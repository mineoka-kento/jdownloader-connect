export async function encrypt(
	data: string,
	ivKey: ArrayBuffer
): Promise<string> {
	const iv = ivKey.slice(0, ivKey.byteLength / 2);
	const key = ivKey.slice(ivKey.byteLength / 2, ivKey.byteLength);
	return btoa(
		Array.from(
			new Uint8Array(
				await crypto.subtle.encrypt(
					{ name: "AES-CBC", iv, length: 128 },
					await crypto.subtle.importKey(
						"raw",
						key,
						{ name: "AES-CBC", length: 128 },
						false,
						["encrypt"]
					),
					new TextEncoder().encode(data)
				)
			),
			(byte) => String.fromCharCode(byte)
		).join("")
	);
}
export async function decrypt(
	data: string,
	ivKey: ArrayBuffer
): Promise<string> {
	const iv = ivKey.slice(0, ivKey.byteLength / 2);
	const key = ivKey.slice(ivKey.byteLength / 2, ivKey.byteLength);
	return new TextDecoder().decode(
		await crypto.subtle.decrypt(
			{ name: "AES-CBC", iv, length: 128 },
			await crypto.subtle.importKey(
				"raw",
				key,
				{ name: "AES-CBC", length: 128 },
				false,
				["decrypt"]
			),
			Uint8Array.from<string>(atob(data), (m) => m.codePointAt(0) ?? 0)
				.buffer
		)
	);
}

export async function createEncryptionToken(
	oldTokenBuff: ArrayBuffer,
	updateToken: string
) {
	const updateTokenBuff = new Uint8Array(
		updateToken.match(/[\dA-F]{2}/gi)?.map((s) => parseInt(s, 16)) ?? []
	).buffer;
	const mergedBuffer = new ArrayBuffer(
		oldTokenBuff.byteLength + updateTokenBuff.byteLength
	);
	const mergedView = new Uint8Array(mergedBuffer);
	mergedView.set(new Uint8Array(oldTokenBuff), 0);
	mergedView.set(new Uint8Array(updateTokenBuff), oldTokenBuff.byteLength);
	return sha256(mergedBuffer);
}

export async function sha256ByString(data: string) {
	return sha256(new TextEncoder().encode(data));
}
export async function sha256(data: BufferSource) {
	return crypto.subtle.digest("SHA-256", data);
}
export function uniqueRid() {
	return Math.floor(Date.now());
}
export function hexString(buffer: ArrayBuffer) {
	return [...new Uint8Array(buffer)]
		.map((x) => x.toString(16).padStart(2, "0"))
		.join("");
}
