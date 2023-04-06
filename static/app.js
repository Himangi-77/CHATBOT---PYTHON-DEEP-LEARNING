const XLSX = require('xlsx');
class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector('.chatbox__button'),
      chatBox: document.querySelector('.chatbox__support'),
      sendButton: document.querySelector('.send__button')
    }

    this.state = false;
    this.messages = [];
  }

  display() {
    const {openButton, chatBox, sendButton} = this.args;

    openButton.addEventListener('click', () => {
      this.toggleState(chatBox);

      if (!this.messages.length) {
        const msg1 = {name : "Alice", message : "Hey! This is Alice. Welcome to Zi Cloud. May I know your name?"};
        this.messages.push(msg1);
        this.updateChatText(chatBox);
      }
    });

    sendButton.addEventListener('click', () => this.onSendButton(chatBox));

    const node = chatBox.querySelector('input');
    node.addEventListener('keyup', ({key}) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatBox){
      this.state = !this.state;

      if(this.state) {
          chatBox.classList.add('chatbox--active')
      } else {
          chatBox.classList.remove('chatbox--active')
      }
  }

  onSendButton(chatBox) {
    const textField = chatBox.querySelector('input');
    const text1 = textField.value.trim();

    if (text1 === "") {
        return;
    }

    if (this.messages.length === 1) {
        const msg1 = {name : "User", message : text1};
        this.messages.push(msg1);

        const msg2 = {name: "Alice", message: `Great. Hope you're having a nice day, ${text1}.`};
        this.messages.push(msg2);
    } else if (this.messages.length === 3) {
        const msg1 = {name : "User", message : text1};
        this.messages.push(msg1);

        const msg2 = {name: "Alice", message: "I would like to ask you a few routine questions. Should we start?"};
        this.messages.push(msg2);
    } else if (this.messages.length === 5) {
        const msg1 = {name : "User", message : text1};
        this.messages.push(msg1);

        const msg2 = {name: "Alice", message: "Can the platform integrate with other tools and software that you use in your marketing stack?"};
        this.messages.push(msg2);
    } else if (this.messages.length === 7) {
      const msg1 = {name : "User", message : text1};
      this.messages.push(msg1);

      const msg2 = {name: "Alice", message: "How does the platform handle different types of data, such as customer demographics, website traffic, and social media engagement?"};
      this.messages.push(msg2);
     } else if (this.messages.length === 9) {
      const msg1 = {name : "User", message : text1};
      this.messages.push(msg1);

      const msg2 = {name: "Alice", message: "What is your budget for a marketing analytics platform?"};
      this.messages.push(msg2);
     }  else {
        const msg1 = {name : "User", message : text1};
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({message:text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            const msg2 = {name: "Alice", message: r.answer};
            this.messages.push(msg2);
            this.updateChatText(chatBox);
            textField.value = '';
        }).catch((error) => {
            console.error(error);
            this.updateChatText(chatBox);
            textField.value = '';
        });
    }

    this.updateChatText(chatBox);
    textField.value = '';
}


  updateChatText(chatBox) {
      let html = '';
      this.messages.slice().reverse().forEach(function(item) {
          if(item.name==="Alice") {
              html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
          } else {
              html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
          }
      });

      const chatmessage = chatBox.querySelector('.chatbox__messages');
      chatmessage.innerHTML = html;
  }
}

const chatBox = new Chatbox();
chatBox.display();


/*
class Chatbox {
    constructor() {
      this.args = {
        openButton: document.querySelector('.chatbox__button'),
        chatBox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button')
      }
  
      this.state = false;
      this.messages = [];
    }
  
    display() {
      const {openButton, chatBox, sendButton} = this.args;
  
      openButton.addEventListener('click', () => this.toggleState(chatBox));
  
      sendButton.addEventListener('click', () => this.onSendButton(chatBox));
  
      const node = chatBox.querySelector('input');
      node.addEventListener('keyup', ({key}) => {
        if (key === "Enter") {
          this.onSendButton(chatBox);
        }
      });
    }

    toggleState(chatBox){
        this.state = !this.state;

        if(this.state) {
            chatBox.classList.add('chatbox--active')
        } else {
            chatBox.classList.remove('chatbox--active')
        }
    }

	onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }
    
        let msg1 = {name : "User", message : text1}
        this.messages.push(msg1);
    
        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({message:text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(response => {
            if (response.answer === "I do not understand...") {
                // If the chatbot cannot answer the question, redirect to ChatGPT
                textField.value = '';
                this.askGPT(chatBox, text1);
            } else {
                // Otherwise, display the chatbot's response
                let msg2 = {name: "Chatbot", message: response.answer};
                this.messages.push(msg2);
                this.updateChatText(chatBox);
                textField.value = '';
            }
        })
        .catch(error => {
            console.error(error);
            // If there is an error, display an error message
            let msg2 = {name: "Chatbot", message: "I'm sorry, there was an error. Please try again later."};
            this.messages.push(msg2);
            this.updateChatText(chatBox);
            textField.value = ''
        });
    }
    
    askGPT(chatBox, question) {
      fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `Q: ${question}\nA:`,
          max_tokens: 50,
          temperature: 0.7,
          n: 1,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
      })
      .then(response => response.json())
      .then(response => {
        if (response.choices[0].text === 'Sorry, I do not know the answer.') {
          // If ChatGPT cannot answer the question, display a message to the user
          let msg2 = {name: "Chatbot", message: "I'm sorry, I don't know the answer to that."};
          this.messages.push(msg2);
          this.updateChatText(chatBox);
          textField.value = '';
        } else {
          // Otherwise, display ChatGPT's response
          let msg2 = {name: "Chatbot", message: response.choices[0].text};
          this.messages.push(msg2);
          this.updateChatText(chatBox);
          textField.value = '';
        }
      })
        .catch(error => {
            console.error(error);
            // If there is an error, display an error message
            let msg2 = {name: "Chatbot", message: "I'm sorry, there was an error. Please try again later."};
            this.messages.push(msg2);
            this.updateChatText(chatBox);
            textField.value = ''
        });
    }

    updateChatText(chatBox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if(item.name==="Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatBox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
  }

const chatBox = new Chatbox();
chatBox.display();
*/