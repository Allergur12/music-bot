const CommandBuilder = require('../struct/CommandBuilder');

module.exports = new CommandBuilder({
	name: 'stop',
	description: 'Destruye el reproductor *player.destroy() uwu*',
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

		player.destroy();

		return interaction.followUp({
			content: `detuve la musica uwu`
		});
	}
});
