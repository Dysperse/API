const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

module.exports = withPlugins(
	[
		[
			withPWA({
				pwa: {
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
