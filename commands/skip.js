const CommandBuilder = require('../struct/CommandBuilder');

module.exports = new CommandBuilder({
	name: 'skip',
	description: 'Omite la canción actual y pasa a la siguiente',
	type: 'CHAT_INPUT',
	options: [],

	run: async ({ client, interaction }) => {
		const member = interaction.member;
		const me = interaction.guild.me;

		const player = await client.erela.get(interaction.guildId);

		if (!player || !player.queue.current)
			return interaction.followUp({
				content: '\\🎶 No estoy reproduciendo música.'
			});

		if (me.voice.channelId != member.voice?.channelId)
			return interaction.followUp({
				content: `\\🔉 Entra a mi canal de voz: ${me.voice.channel}`
			});

		if (!player.queue.length)
			return interaction.followUp({
				content: `No hay más canciones en cola`
			});

		player.stop();

		return interaction.followUp({
			content: `se omitió la música, pasando a la siguiente.................`
		});
	}
});
