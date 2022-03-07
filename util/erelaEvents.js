const { Util } = require('discord.js');

/**
 * @param {import('../struct/ExtendedClient')} client Cliente
 */
module.exports = client => {
	client.erela
		.on('nodeConnect', node => console.log(`🌋 Conectado: ${node.options.host}`))
		.on('nodeDisconnect', node => console.log(`🌋 Desconectado: ${node.options.host}`))
		.on('nodeError', (_node, err) => console.log(`🌋 Error: ${err}`))
		.on('trackStart', (p, t) => {
			client.channels.cache.get(p.textChannel).send({
				embeds: [
					{
						color: 'RANDOM',
						description: `${Util.escapeMarkdown(t.title)} \`|\` [${t.requester}]`,
						title: '\\🎵 Reproduciendo ahora',
						footer: {
							text: 'Autor: ' + t.author
						}
					}
				]
			});
		})
		.on('playerMove', (p, oldch, newch) => {
			const channel = client.channels.cache.get(p.textChannel);

			if (!newch) {
				p.destroy();
				channel.send('Me desconectaron... :a:');
			} else if (newch != oldch) {
				p.setVoiceChannel(newch);
				channel.send('Me movieron de canal. Para seguir escuchando musica usa `/resume`');
			}
		})
		.on('queueEnd', p => {
			const channel = client.channels.cache.get(p.textChannel);
			channel.send('La cola terminó');

			if (!client.config['24_7']) p.destroy();
		});

	client.on('raw', data => {
		client.erela.updateVoiceState(data);
	});
};
