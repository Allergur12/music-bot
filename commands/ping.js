const CommandBuilder = require('../struct/CommandBuilder');

module.exports = new CommandBuilder({
	name: 'ping',
	description: 'Pong 🏓',
	type: 'CHAT_INPUT',
	options: [],
	run: ({ client, interaction }) => {
		interaction.followUp({
			content: `Pong! ${client.ws.ping} ms`
		});
	}
});
