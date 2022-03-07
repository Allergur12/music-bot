module.exports = {
	name: 'interactionCreate',

	/**
	 * @param {import('../struct/ExtendedClient')} client Client
	 * @param {import('discord.js').Interaction} interaction
	 */
	async run(client, interaction) {
		if (!interaction.guild)
			interaction.reply(
				'No puedo acceder a los datos del servidor, invitame con una invitacion normal'
			);

		if (interaction.isCommand()) {
			const cmd = client.commands.get(interaction.commandName);
			if (!cmd)
				interaction.reply({
					content: 'No encontre ese comando',
					ephemeral: true
				});

			interaction.deferReply();
			cmd.run({ client, interaction });
		}
	}
};
