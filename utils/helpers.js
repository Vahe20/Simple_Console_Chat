const { log } = require("./logger");

const getAllUserNames = (clients, socket) => {
	return clients
		.map(c => {
			if (c === socket) return `(${c.name}): (You)`;
			return c.name;
		})
		.join(", ");
};

const broadcast = (clients, senderSocket, message) => {
	clients.forEach(c => {
		if (c !== senderSocket) {
			c.write(message);
		}
	});
};

const ConsoleCommand = (clients, data, socket) => {
	if (data.toString().startsWith("/list")) {
		const userList = getAllUserNames(clients, socket);
		socket.write(`Connected users: ${userList}\n`);
		return true;
	}
	if (data.toString().startsWith("/rename ")) {
		const newName = data.toString().substring(6).trim();
		const client = clients.find(c => c === socket);
		if (client) {
			const oldName = client.name;
			client.name = newName;
			broadcast(socket, `${oldName} is now known as ${newName}.\n`);
			socket.write(`Your name has been changed to ${newName}.\n`);
		}
		return true;
	}
	if (
		data.toString().startsWith("/quit") ||
		data.toString().startsWith("/q")
	) {
		const index = clients.findIndex(c => c === socket);
		if (index !== -1) {
			clients.splice(index, 1);
		}
		socket.end("You have left the chat.\n");
		broadcast(socket, `${socket.name} has left the chat.\n`);
		return true;
	}
	if (data.toString().startsWith("@")) {
		const messageParts = data.toString().split(" ");
		const targetName = messageParts[0].substring(1);
		const privateMessage = messageParts.slice(1).join(" ");
		const targetClient = clients.find(c => c.name === targetName);
		if (targetClient) {
			targetClient.write(`(Private) ${socket.name}: ${privateMessage}\n`);
			log(socket.name, targetName, privateMessage);
			socket.write(`(Private to ${targetName}): ${privateMessage}\n`);
			return true;
		} else {
			socket.write(`User ${targetName} not found.\n`);
			return true;
		}
	}
	if (data.toString().startsWith("/help")) {
		const helpMessage =
			"Available commands:\n" +
			"/list - List all connected users\n" +
			"/rename <new_name> - Change your display name\n" +
			"/quit or /q - Leave the chat\n" +
			"@<username> <message> - Send a private message to <username>\n" +
			"/help - Show this help message\n";
		socket.write(helpMessage);
		return true;
	}

	return false;
};

module.exports = { ConsoleCommand, broadcast };
