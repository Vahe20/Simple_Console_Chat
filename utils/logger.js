const fs = require("fs");
require("dotenv").config();

const LOG_FILE = process.env.LOG_FILE || "chat_server.log";
const LOG_DIR = process.env.LOG_DIR || "./logs";

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}

const log = (user, dest, message) => {
	const time = new Date().toISOString();
	const logMessage = `[${time}] ${user} -> ${dest}: ${message}\n`;
	fs.appendFileSync(`${LOG_DIR}/${LOG_FILE}`, logMessage);
};

module.exports = { log };
