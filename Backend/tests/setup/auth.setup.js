// set up authentication
if (!process.env.CI) {
	require("dotenv").config({ path: "./.env.test" });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
	global.authToken = await fetchWith(
		process.env.AUTH0_PRIVILEGED_CLIENT_ID?.trim(),
		process.env.AUTH0_PRIVILEGED_CLIENT_SECRET?.trim(),
	);
	global.unprivilegedAuthToken = await fetchWith(
		process.env.AUTH0_CLIENT_ID?.trim(),
		process.env.AUTH0_CLIENT_SECRET?.trim(),
	);
})();

async function fetchWith(client_id, client_secret) {
	const maxRetries = 3;
	let attempt = 0;
	while (attempt < maxRetries) {
		try {
			const res = await fetch(
				"https://dev-i0ksanu2a66behjf.us.auth0.com/oauth/token",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						client_id: client_id,
						client_secret: client_secret,
						audience: process.env.AUTH0_AUDIENCE?.trim(),
						grant_type: "client_credentials",
					}),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(`Auth0 error: ${data.error || res.status}`);
			}

			return data.access_token;
		} catch (err) {
			console.error(`Attempt ${attempt + 1} failed with: `, err.message);
			attempt++;

			if (attempt < maxRetries) {
				await sleep(1000);
			} else {
				console.error("All tries failed");
				process.exit(1);
			}
		}
	}
}
