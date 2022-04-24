import { blue } from "@mui/material/colors";
import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import "../styles/global.css";
import useFetch from "react-fetch-hook";

declare var ACCOUNT_DATA: Object;
declare var session: Object;

function SmartlistApp({ user, Component, pageProps }: any): JSX.Element {
	const ACCESS_TOKEN =
		"2d8a0db9ca24b84453d7e12368cb9d18c5397b1cf6d96a8d2381dcf448ca60caf9cc28e8f0d41c559cb9df0daf16f37e5440ceed52203b860e9b4950d42d5c90f8a84474b8f5fd4b0599a2fe66d2fc4f86ceaad7e6ef44b503e10d28eb0b60af8fc86168154cb58cdcad0f893c2f61cc21030036217e702250cd6cfd66060e58349c1c8b79dd5427f62808e8e978533b73159c27b72d0692218b54b7eca9dd63fd266505d29d634e938528ac1118d3616ce47ce4b458d1747482e36d682b4f30dcf2c00ee59b772aff0ad4d77130778f1e9da25cc5b2cb8ec8a4840ca3e3c558db5ac0e87187d167e32eed1dfd49d27b4a0b9a59e3d40edf67b35bf2e6633038e770837e702ac2b73c0ae0e5109f4738ebf0f45741d05dd3866cfbbdfd6a33447c15bdf5f38d3b181315b5f8";

	const { data } = useFetch("/api/user", {
		method: "POST",
		body: new URLSearchParams({
			token: ACCESS_TOKEN
		})
	});

	var ACCOUNT_DATA = {
		accessToken: ACCESS_TOKEN,
		email: "manuthecoder@protonmail.com",
		name: "Manu G",
		financePlan: "medium-term",
		image: "https://i.ibb.co/PrqtZZ3/2232ae71-edbe-4035-8c89-9cb9039fa06d.jpg",
		notificationMin: 7,
		budget: 185,
		onboarding: 1,
		verifiedEmail: 1,
		purpose: "personal",
		defaultPage: "finances",
		studentMode: "on",
		financeToken: "test_token_ianli4n7hb7q2",
		familyCount: 9,
		houseName: "Cluster d29bf0fd3106",
		currency: "dollar",
		theme: {
			dark: [74, 20, 140],
			original: [106, 27, 154],
			light: [123, 31, 162],
			tint: [243, 229, 245]
		},
		preferences: { homePage: "/app/pages/dashboard.php" }
	};
	global.ACCOUNT_DATA = ACCOUNT_DATA;
	global.session = data;

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link
					rel="apple-touch-icon"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="57x57"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-57x57.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="72x72"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-72x72.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="76x76"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-76x76.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="114x114"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-114x114.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-120x120.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="144x144"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-144x144.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="https://smartlist.tech/app/img/logo/apple-touch-icon//apple-touch-icon-180x180.png"
				/>
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta name="theme-color" content={blue[50]} />
				<link
					href="https://fonts.googleapis.com/css2?family=Outfit:wght@350"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@40,500,1,200"
				/>
				<link href="/manifest.webmanifest" rel="manifest" />
				<link href="/logo/48x48.png" rel="shortcut icon" />
				<title>Smartlist</title>
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}

export default SmartlistApp;
