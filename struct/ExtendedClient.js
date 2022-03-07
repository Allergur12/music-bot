require('dotenv').config();

const { Client, Collection } = require('discord.js');
const { Manager } = require('erela.js');
const { LavasfyClient } = require('lavasfy');
const config = require('../config');
const fs = require('fs');

module.exports = class ExtendedClient extends Client {
	constructor(settings = config) {
		super(settings.clientOptions);

		this.commands = new Collection();

		this.erela = new Manager({
			autoplay: true,
			nodes: [settings.lavaNode],
			send: (id, payload) => {
				const server = this.guilds.cache.get(id);
				if (server) server.shard.send(payload);
			}
		});

		this.lavasfy = new LavasfyClient(
			{
				clientID: settings.spotify.id,
				clientSecret: settings.spotify.secret,
				audioOnlyResults: true,
				autoResolve: true,
				useSpotifyMetadata: true,
				playlistLoadLimit: 3
			},
			[
				{
					host: settings.lavaNode.host,
					id: settings.lavaNode.identifier,
					password: settings.lavaNode.password,
					port: settings.lavaNode.port,
					secure: settings.lavaNode.secure
				}
			]
		);

		this.lavasfy.requestToken().then(() => {});

		if (!this.token) {
			if ('token' in settings && settings.token.length) this.token = settings.token;
			// eslint-disable-next-line no-undef
			else if ('DISCORD_TOKEN' in process.env) this.token = process.env.DISCORD_TOKEN;
			else this.token = 'dame un token :a:';
		}

		this.config = config;
	}

	init() {
		this.login();
		this.loadCommands();
		this.loadEvents();
	}

	loadCommands() {
		const cmds = fs.readdirSync('./commands/');
		const array = [];

		cmds.forEach(file => {
			const cmd = require(`../commands/${file}`);

			if (['USER', 'MESSAGE'].includes(cmd.type)) {
				delete cmd.description;
				delete cmd.options;
			}

			console.log('command loaded: ' + file);

			this.commands.set(cmd.name, cmd);
			array.push(cmd);
		});

		this.on('ready', async () => {
			// Global
			const globalUpload = async arr => {
				await this.aplication.commands.set(arr);
			};

			// Guild
			const guildUpload = async arr => {
				if (!config.server || !config.server.length)
					throw new Error('Establece la ID de un servidor en `config.js`');

				await this.guilds.cache.get(config.server).commands.set(arr);
			};

			if (config.testing) guildUpload(array);
			else globalUpload(array);
		});
	}

	loadEvents() {
		fs.readdirSync('./events/').forEach(file => {
			const event = require(`../events/${file}`);

			console.log('event loaded: ' + file);

			if (!event.name || !event.run)
				throw new Error(`El archivo ${file} no tiene la propiedad name/run`);

			this.on(event.name, (...args) => event.run(this, ...args));
		});
	}
};
