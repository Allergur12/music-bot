module.exports = class CommandBuilder {
	/**
	 *
	 * @param {{
	 * 	name: string;
	 * 	description: string;
	 * 	type: import('discord.js').ApplicationCommandType;
	 * 	options: import('discord.js').ApplicationCommandOptionData[];
	 * 	run: (options: {
	 * 		client: import('../struct/ExtendedClient')
	 *		interaction: import('discord.js').CommandInteraction & {
	 *			member: import('discord.js').GuildMember
	 *		}
	 *	}) => any;
	 * }} commandOptions
	 */
	constructor(commandOptions) {
		this.name = commandOptions.name;
		this.description = commandOptions.description;
		this.type = commandOptions.type;
		this.options = commandOptions.options;
		this.run = commandOptions.run;
	}
};
