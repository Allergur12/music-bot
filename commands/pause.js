const CommandBuilder = require('../struct/CommandBuilder');

module.exports = new CommandBuilder({
	name: 'pause',
	description: 'Pausa la musica',
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

		if (player.paused)
			return interaction.followUp({
				content: `La musica ya esta pausada`
			});

		player.pause(true);

		return interaction.followUp({
			content: `Listo`
		});
	}
});
