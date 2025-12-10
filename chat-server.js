const net = require("node:net");
const { ConsoleCommand, broadcast } = require("./utils/helpers");
const { log } = require("./utils/logger");
require("dotenv").config();

const clients = [];
const PORT = process.env.PORT || 3001;
const MAX_CLIENTS = process.env.MAX_CLIENTS || 10;

const server = net.createServer(socket => {
	if (clients.length >= MAX_CLIENTS) {
		socket.write("Server is full. Try again later.\n");
		socket.end();
		return;
	}

	socket.name = `User${Math.floor(Math.random() * 9999)}`;
	socket.id = Math.floor(Math.random() * 100000);

	clients.push(socket);

	socket.write(`Welcome to the chat, ${socket.name}!\n`);
	socket.write("Type /Help for a list of commands.\n");

	broadcast(clients, socket, `${socket.name} has joined the chat.\n`);
	log("Server", "All", `${socket.name} has joined the chat.`);

	socket.on("data", data => {
		if (data.length === 0) return;
		if (data.length > 500) {
			socket.write("Message too long. Please limit to 500 characters.\n");
			return;
		}
		if (ConsoleCommand(clients, data, socket)) return;

		log(socket.name, "All", data.toString().trim());
		broadcast(clients, socket, `${socket.name}: ${data.toString()}`);
	});

	socket.on("end", () => {
		const index = clients.findIndex(c => c === socket);
		if (index !== -1) {
			clients.splice(index, 1);
		}
		broadcast(clients, socket, `${socket.name} has left the chat.\n`);
		log("Server", "All", `${socket.name} has left the chat.`);
	});

	socket.on("error", err => {
		console.error(`Socket error: ${err}`);
		const index = clients.findIndex(c => c === socket);
		if (index !== -1) {
			clients.splice(index, 1);
		}
		log(
			"Server",
			"All",
			`${socket.name} disconnected due to an error: ${err.message}`
		);
		broadcast(
			clients,
			socket,
			`${socket.name} left the chat due to an error.\n`
		);
	});
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
