const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

module.exports = withPlugins(
	[
		[
			withPWA({
				pwa: {
					disable: process.env.NODE_ENV === 'development',
					mode: "production",
					dest: "public"
				}
			})
		]
	],
	{
		reactStrictMode: true
	}
);
