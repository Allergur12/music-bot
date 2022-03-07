const CommandBuilder = require('../struct/CommandBuilder');

module.exports = new CommandBuilder({
	name: 'volume',
	description: 'Cambia el volmuen del reproductor',
	type: 'CHAT_INPUT',
	options: [
		{
			description: 'Cantidad de volumen',
			name: 'cantidad',
			type: 'INTEGER',
			minValue: 0,
			maxValue: 100,
			required: false
		}
	],

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

		const cantidad = interaction.options.getInteger('cantidad');

		if (!cantidad)
			return interaction.followUp({
				content: `\\🔉 Volumen actual: \`${player.volume}%\``
			});

		player.setVolume(cantidad);

		return interaction.followUp({
			content: `Listo`
		});
	}
});
