require('dotenv').config()
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const { Configuration, OpenAIApi } = require('openai')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 3000

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('New user connected')

  // Initialize the conversation history
  const conversationHistory = []

  socket.on('sendMessage', async (message, callback) => {
    try {
      // Add the user message to the conversation history
      conversationHistory.push({ role: 'user', content: message })

      let liveMessage = ''

      const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: conversationHistory,
        stream: true
      }, { responseType: 'stream' })

      completion.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '')
        for (const line of lines) {
          const message = line.replace(/^data: /, '')
          if (message === '[DONE]') {
            conversationHistory.push({
              role: 'assistant',
              content: liveMessage
            })
            liveMessage = ''
            socket.emit('message', '-[DONE]-')
            return // Stream finished
          }
          try {
            const parsed = JSON.parse(message)
            const response = parsed.choices[0].delta.content
            if (response) {
              socket.emit('message', response)
              liveMessage += response
            }
          } catch (error) {
            console.error('Could not JSON parse stream message', message, error)
          }
        }
      })
      callback()
    } catch (error) {
      console.error(error)
      // eslint-disable-next-line
      callback('Error: Unable to connect to the chatbot')
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
