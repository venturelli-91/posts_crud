#!/usr/bin/env node

const BASE = "https://dev.codeleap.co.uk/careers/";

function ok(msg) {
	console.log("\x1b[32m%s\x1b[0m", msg);
}
function fail(msg) {
	console.error("\x1b[31m%s\x1b[0m", msg);
}

async function fetchJson(url, opts) {
	const res = await fetch(url, opts);
	const text = await res.text();
	let body = null;
	try {
		body = text ? JSON.parse(text) : undefined;
	} catch (e) {
		/* ignore */
	}
	return { res, body, raw: text };
}

function validateItemShape(item) {
	if (!item) return false;
	const keys = ["id", "username", "created_datetime", "title", "content"];
	return keys.every((k) => Object.prototype.hasOwnProperty.call(item, k));
}

async function main() {
	console.log("API smoke test starting...");

	// 1) LIST
	try {
		const { res, body, raw } = await fetchJson(BASE);
		if (!res.ok) {
			fail(`GET list failed (status ${res.status})`);
			console.error("Response raw body:", raw);
			console.error("Parsed body:", body);
			process.exitCode = 1;
			return;
		}

		// Accept either an array response or the paginated object { results: Post[] }
		let items = [];
		if (Array.isArray(body)) items = body;
		else if (body && Array.isArray(body.results)) items = body.results;
		else {
			fail(`GET list returned unexpected shape (status ${res.status})`);
			console.error("Response raw body:", raw);
			console.error("Parsed body:", body);
			process.exitCode = 1;
			return;
		}

		ok(`GET list OK — ${items.length} items`);
	} catch (err) {
		fail("GET list request failed: " + err.message);
		process.exitCode = 1;
		return;
	}

	// 2) CREATE
	const ts = Date.now();
	const createPayload = {
		username: `smoke_${ts}`,
		title: "smoke title",
		content: "smoke content",
	};
	let created = null;
	try {
		const { res, body } = await fetchJson(BASE, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(createPayload),
		});

		if (!res.ok || !validateItemShape(body)) {
			fail(`POST failed (status ${res.status}). Body: ${JSON.stringify(body)}`);
			process.exitCode = 1;
			return;
		}
		created = body;
		ok(`POST OK — created id=${created.id}`);
	} catch (err) {
		fail("POST request failed: " + err.message);
		process.exitCode = 1;
		return;
	}

	// 3) PATCH (update)
	const updatePayload = {
		title: "smoke title updated",
		content: "smoke content updated",
	};
	try {
		const url = `${BASE}${created.id}/`;
		const { res, body } = await fetchJson(url, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatePayload),
		});
		if (!res.ok || !validateItemShape(body)) {
			fail(
				`PATCH failed (status ${res.status}). Body: ${JSON.stringify(body)}`
			);
			process.exitCode = 1;
			return;
		}
		if (
			body.title !== updatePayload.title ||
			body.content !== updatePayload.content
		) {
			fail("PATCH response does not contain updated fields");
			process.exitCode = 1;
			return;
		}
		ok(`PATCH OK — id=${created.id} updated`);
	} catch (err) {
		fail("PATCH request failed: " + err.message);
		process.exitCode = 1;
		return;
	}

	// 4) DELETE
	try {
		const url = `${BASE}${created.id}/`;
		const res = await fetch(url, { method: "DELETE" });
		if (!(res.status >= 200 && res.status < 300)) {
			fail(`DELETE failed (status ${res.status})`);
			process.exitCode = 1;
			return;
		}
		ok(`DELETE OK — id=${created.id}`);
	} catch (err) {
		fail("DELETE request failed: " + err.message);
		process.exitCode = 1;
		return;
	}

	console.log("\nAll smoke tests passed.");
}

// Node CJS compatibility: wrap in async IIFE
(async () => {
	try {
		await main();
	} catch (e) {
		console.error("Unexpected error", e);
		process.exitCode = 1;
	}
})();
