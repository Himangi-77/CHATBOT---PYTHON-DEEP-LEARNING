# Chatbot Deployment with Flask and JavaScript

This is a 75% pre-cooked chatbot which was deployed using Flask and Jinja2 template. The system was utilized to integrate the chatbot with an Open AI engine, allowing any queries outside the chatbot's training to be redirected to a backend chat GPT simulation. The integration was successful by using the text-davinci-002 engine.

## Initial Setup:
This repo currently contains the starter files.

Clone repo and create a virtual environment
```
$ git clone https://github.com/python-engineer/chatbot-deployment.git
$ cd chatbot-deployment
$ python3 -m venv venv
$ . venv/bin/activate
```
Install dependencies
```
$ (venv) pip install Flask torch torchvision nltk
```
Install nltk package
```
$ (venv) python
>>> import nltk
>>> nltk.download('punkt')
```
Modify `intents.json` with different intents and responses for your Chatbot

Run
```
$ (venv) python train.py
```
This will dump data.pth file. And then run
the following command to test it in the console.
```
$ (venv) python chat.py
