import {
	createEncryptionToken,
	decrypt,
	encrypt,
	hexString,
	sha256ByString,
	uniqueRid,
} from "./Crypto";
import { ConnectResponse } from "./ResponseStructures";

const MYJDOWNLOADER_ENDPOINT = "https://api.jdownloader.org";

export interface ConnectParams {
	email: string;
	password: string;
	appKey?: string;
	apiVer?: number;
}

export default async function createCallServerEnvironment({
	email,
	password,
	appKey,
	apiVer,
}: Required<ConnectParams>) {
	const [loginSecret, deviceSecret] = await Promise.all([
		sha256ByString(`${email}${password}server`),
		sha256ByString(`${email}${password}device`),
	]);
	let {
		sessiontoken: sessionToken,
		regaintoken: regainToken,
	}: ConnectResponse = await callServer("/my/connect", loginSecret, {
		appkey: appKey,
		email,
	});
	let serverEncryptionToken = await createEncryptionToken(
		loginSecret,
		sessionToken
	);
	let deviceEncryptionToken = await createEncryptionToken(
		deviceSecret,
		sessionToken
	);

	async function callServer(
		query: string,
		key: ArrayBuffer,
		params: Record<string, string>
	) {
		const rid = uniqueRid();
		const path = `${query}?${new URLSearchParams({
			...params,
			rid: String(rid),
		}).toString()}`;
		const signature = hexString(
			await crypto.subtle.sign(
				{ name: "HMAC", hash: "SHA-256" },
				await crypto.subtle.importKey(
					"raw",
					key,
					{ name: "HMAC", hash: "SHA-256" },
					false,
					["sign"]
				),
				new TextEncoder().encode(path)
			)
		);
		const response = await fetch(
			`${MYJDOWNLOADER_ENDPOINT}${path}&signature=${signature}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
			}
		);
		if (response.ok) {
			return decryptAndvalidate(await response.text(), key, rid);
		} else {
			throw new TypeError(await response.text());
		}
	}

	return {
		callServer,
		getDeviceSecret() {
			return deviceSecret;
		},
		getSessionToken() {
			return sessionToken;
		},
		setSessionToken(token: string) {
			sessionToken = token;
		},
		getRegainToken() {
			return regainToken;
		},
		setRegainToken(token: string) {
			regainToken = token;
		},
		getServerEncryptionToken() {
			return serverEncryptionToken;
		},
		setServerEncryptionToken(token: ArrayBuffer) {
			serverEncryptionToken = token;
		},
		getDeviceEncryptionToken() {
			return deviceEncryptionToken;
		},
		setDeviceEncryptionToken(token: ArrayBuffer) {
			deviceEncryptionToken = token;
		},
		createCallDeviceEnvironment(deviceId: string) {
			return {
				async callDevice(
					query: string,
					params?: unknown
				): Promise<any> {
					const rid = uniqueRid();
					const body = await encrypt(
						JSON.stringify({
							apiVer,
							rid,
							url: query,
							...(params != null
								? { params: [JSON.stringify(params)] }
								: {}),
						}),
						deviceEncryptionToken
					);
					const response = await fetch(
						`${MYJDOWNLOADER_ENDPOINT}/t_${encodeURI(
							sessionToken
						)}_${encodeURI(deviceId)}${query}`,
						{
							method: "POST",
							headers: {
								"Content-Type":
									"application/json; charset=utf-8",
							},
							body,
						}
					);
					if (response.ok) {
						return (
							await decryptAndvalidate(
								await response.text(),
								deviceEncryptionToken,
								rid
							)
						).data;
					} else {
						throw new TypeError(
							await decrypt(
								(
									await response.json()
								).message,
								deviceEncryptionToken
							)
						);
					}
				},
			} as const;
		},
	} as const;
}

async function decryptAndvalidate(
	data: string,
	ivKey: ArrayBuffer,
	rid: number
): Promise<any> {
	const result = JSON.parse(await decrypt(data, ivKey));
	if (result.rid !== rid) {
		throw new TypeError("Invalid response");
	}
	return result;
}
