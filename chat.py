import random
import json
import torch
import pandas as pd
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
import openai

openai.api_key = "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"

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Alice"

def get_gpt_response(msg):
    prompt = f"User: {msg}"
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
        frequency_penalty=0,
        presence_penalty=0
    )
    message = completions.choices[0].text.strip()
    # get only the first response or until the message hits the word "User"
    message = message.split("User")[0].strip()
    return message

def get_response(msg):
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])

    # check for default response options
    if "help" in msg.lower():
        return ["How can I assist you?", "What can I help you with?"]
    elif "hello" in msg.lower() or "hi" in msg.lower():
        return ["Hi there!", "Hello! How may I help you today?"]
    
    # Redirect unanswered questions to ChatGPT
    response = get_gpt_response(msg)
    return response

if __name__ == "__main__":
    # create an empty dataframe
    df = pd.DataFrame(columns=['User', 'Alice'])

    print("Hello! I am Alice.")

    # default responses
    default_responses = ["How can I help you today?"]
    for response in default_responses:
        print(bot_name + ": " + response)
        df.loc[len(df)] = ["", response]

    while True:
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(bot_name + ": " + resp)

        # record user input and bot response in dataframe
        df.loc[len(df)] = [sentence, resp]

    # save dataframe to excel file
    df.to_excel("Conversations.xlsx", index=False)

