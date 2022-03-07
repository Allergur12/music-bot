const events = require('../util/erelaEvents');

module.exports = {
	name: 'ready',

	/**
	 * @param {import('../struct/ExtendedClient')} client Client
	 */
	run(client) {
		console.log(`🤖 Listo: ${client.user.tag}`);
		client.erela.init(client.user.id);

		events(client);
	}
};
