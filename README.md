# Chat Server (Node.js TCP)

A lightweight, extensible TCP-based chat server built with Node.js.  
It supports multiple clients, username management, private messaging, logging, server limits, and console commands.

## Features

- Multi-user TCP chat
- Automatic username assignment
- Private messages using `@username`
- Built-in commands:
  - `/list` — show connected users
  - `/rename <newname>` — change your username
  - `/quit` or `/q` — disconnect
  - `/help` — list available commands
- Broadcast messaging
- Logging of private and public messages
- Server capacity limit (`MAX_CLIENTS`)
- Environment-based configuration
- Error-safe client handling

## Project Structure

project/
- ├── chat-server.js # Main TCP server logic
- ├── utils
- │ ├── helpers.js # Commands, broadcast, utilities
- │ └── logger.js # Logging system (file-based)
- ├── logs/
- ├── .env # Server configuration variables
- ├── .gitignore
- ├── package.json # Dependencies + scripts
- ├── README.md

## Configuration
### All settings are stored inside the .env file:
- PORT=""
- MAX_CLIENTS=""
- LOG_FILE=""
- LOG_DIR=""
