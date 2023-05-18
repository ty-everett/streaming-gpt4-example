const socket = window.io()

const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messages = document.getElementById('messages')

function displayMessage (role, message) {
  const div = document.createElement('div')
  div.innerHTML = `<p><b>${
    role === 'user' ? 'You' : 'Assistant'
  }:</b> ${message}</p>`
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
}

function beginMessage (role) {
  const div = document.createElement('div')
  div.id = `new-${role}-message`
  div.innerHTML = `<p><b>${
    role === 'user' ? 'You' : 'Assistant'
  }:</b> </p>`
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
}

function updateMessage (role, newData) {
  const message = document.getElementById(`new-${role}-message`)
  message.children[0].innerHTML += newData
}

function finalizeMessage (role) {
  const message = document.getElementById(`new-${role}-message`)
  message.id = undefined
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const message = messageInput.value
  displayMessage('user', message) // Display user's message in the chat

  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return window.alert(error)
    }

    beginMessage('assistant')
    messageInput.value = ''
    messageInput.focus()
  })
})

socket.on('message', (message) => {
  if (message === '-[DONE]-') {
    finalizeMessage('assistant') // Display assistant's message in the chat
  } else {
    updateMessage('assistant', message)
  }
})
