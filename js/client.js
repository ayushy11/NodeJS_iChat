const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Alert audio on receiving messages
var audio = new Audio('tone.mp3');

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;

    // element.classList --> collection of the class attributes of the element.
    // class attributes = message,position --> metadata.
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }    
}

// Ask new user for his/her name & notify the server
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive the name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// If server sends the message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

// If the form is submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value= ''
})