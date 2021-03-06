const CommandBuilder = require('../struct/CommandBuilder');
const { TrackUtils } = require('erela.js');

module.exports = new CommandBuilder({
	name: 'play',
	description: 'Reproduce musica',
	type: 'CHAT_INPUT',
	options: [
		{
			description: 'Nombre de la canción o URL',
			name: 'query',
			type: 'STRING',
			required: true
		}
	],
	run: async ({ client, interaction }) => {
		const query = interaction.options.getString('query');

		const member = interaction.member;
		const me = interaction.guild.me;

		if (!member.voice.channelId)
			return interaction.followUp({
				embeds: [
					{
						color: 'RED',
						description: `:x: Entra a un canal de voz`
					}
				]
			});

		if (me.voice.channelId && me.voice.channelId != member.voice.channelId)
			return interaction.followUp({
				embeds: [
					{
						color: 'RED',
						description: `:x: Entra a mi canal de voz: ${me.voice.channel}`
					}
				]
			});

		if (!member.voice.channel.permissionsFor(me).has(['VIEW_CHANNEL', 'CONNECT']))
			return interaction.followUp({
				embeds: [
					{
						color: 'RED',
						description: `:x: No tengo permiso para entrar en tu canal de voz :c`
					}
				]
			});

		const node = client.erela.nodes.get('main');
		if (!node || !node.connected)
			return interaction.followUp({
				embeds: [
					{
						color: 'RED',
						description: `:x: No estoy conectado al servidor de música. Espera un poco`
					}
				]
			});

		const player = client.erela.create({
			guild: interaction.guildId,
			textChannel: interaction.channelId,
			node: 'main',
			selfDeafen: true,
			voiceChannel: member.voice.channelId
		});

		if (player.state != 'CONNECTED') await player.connect();

		try {
			if (client.lavasfy.isValidURL(query)) {
				const node = client.lavasfy.nodes.get('main');
				const search = await node.load(query);

				switch (search.loadType) {
					case 'LOAD_FAILED':
						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `:x: No pude convertir esa canción :c`
								}
							]
						});
						break;

					case 'NO_MATCHES':
						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `:x: No pude convertir esa canción :c`
								}
							]
						});
						break;

					case 'TRACK_LOADED': {
						const track = search.tracks[0];
						const build = TrackUtils.build(track, interaction.user);

						player.queue.add(build);

						if (!player.paused && !player.playing && !player.queue.size)
							await player.play();

						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `<:pigstep:913935657271971842> Se agregó ${track.info.title}`
								}
							]
						});
						break;
					}

					case 'PLAYLIST_LOADED': {
						let songs = [];

						for (let i = 0; i < search.tracks.length; i++)
							songs.push(TrackUtils.build(search.tracks[i], interaction.user));

						player.queue.add(songs);

						if (
							!player.paused &&
							!player.playing &&
							player.queue.totalSize == search.tracks.length
						)
							await player.play();

						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `<:pigstep:913935657271971842> Se agregó ${search.playlistInfo.name} \`[${search.tracks.length} canciones]\``
								}
							]
						});
						break;
					}
				}
			} else {
				const search = await player.search(query, interaction.user);

				switch (search.loadType) {
					case 'LOAD_FAILED':
						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `:x: No encontré esa canción`
								}
							]
						});
						break;

					case 'NO_MATCHES':
						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `:x: No encontré esa canción`
								}
							]
						});
						break;

					case 'PLAYLIST_LOADED':
						player.queue.add(search.tracks);

						if (
							!player.playing &&
							!player.paused &&
							player.queue.totalSize == search.tracks.length
						)
							await player.play();

						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `<:pigstep:913935657271971842> Se agregó ${search.playlist.name} \`[${search.tracks.length} canciones]\``
								}
							]
						});
						break;

					default:
						const track = search.tracks[0];
						player.queue.add(track);

						if (!player.paused && !player.playing && !player.queue.size)
							await player.play();

						interaction.followUp({
							embeds: [
								{
									color: 'RED',
									description: `<:pigstep:913935657271971842> Se agregó ${track.title}`
								}
							]
						});
						break;
				}
			}
		} catch (error) {
			console.log(error);
			return interaction.followUp({
				embeds: [
					{
						color: 'RED',
						description: `:x: No pude cargar la canción :c`
					}
				]
			});
		}
	}
});
