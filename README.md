# Streaming GPT-4 Example

This is a simple tutorial for live-streaming GPT-4 responses with Socket.IO on a simple HTML page.

It is based on [another tutorial](https://www.builder.io/blog/stream-ai-javascript), and i have only modified the code to support streaming live data back, so that the AI "types" your response in real-time. I also added a linter.

> **Note:** This only works if you ave GPT-4 access. Join the [waitlist](https://openai.com/waitlist/gpt-4-api) to get access.

## Setup Instructions

1. Install NodeJS and NPM
2. Clone the repository
3. Use your terminal to change to the repo's location, then run `npm i` and install dependencies
4. Copy `.env.template` to `.env` and open the file in an editor
5. Put in your [OpenAI Secret API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) after the equals sign, and save the file
6. Run the command `npm run start` to start the server
7. Now you can visit `http://localhost:3000` in your browser, and talk to the AI!

Extend, fork, be creative, and have fun!

## License

MIT © 2023, Ty J Everett