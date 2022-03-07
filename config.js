module.exports = {
	/**
	 * @type {import('discord.js').ClientOptions}
	 */
	clientOptions: {
		intents: 767,
		allowedMentions: {
			repliedUser: false
		}
	},

	lavaNode: {
		host: 'lavalinknl.ml',
		identifier: 'main',
		password: 'Raccoon',
		port: 2333,
		retryAmount: Infinity,
		secure: false
	},

	server: '912152924422037574', // server para los slash commands

	token: '', // token del bot. Puedes guardarlo en el .env si lo crees necesario

	mongodb: '', // uri de mongodb. Tambien lo puedes guardar en el .env

	/**
	 * Prioridad
	 * ----------
	 * 1: config.js
	 * 2: .env
	 *
	 * Considera esto si tienes el token en el config.js y quieres pasarlo al .env
	 * borra los datos de aqui antes de ponerlo en el .env
	 */

	testing: true, // true => comandos de servidor, mas rapidos, false => comandos globales, mas lento

	spotify: {
		id: '5f573c9620494bae87890c0f08a60293',
		secret: '212476d9b0f3472eaa762d90b19b0ba8'
	},

	'24_7': true
};
