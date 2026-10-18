import { describe, expect, test } from "vite-plus/test";

import {
	createEncryptionToken,
	decrypt,
	encrypt,
	hexString,
	sha256,
	sha256ByString,
} from "./Crypto";

describe("hexString", () => {
	test("バイト列を 0 埋めした小文字の16進文字列に変換する", () => {
		expect(hexString(new Uint8Array([0, 1, 15, 16, 255]).buffer)).toBe(
			"00010f10ff"
		);
	});
});

describe("sha256ByString", () => {
	test("文字列の SHA-256 ハッシュを計算する", async () => {
		expect(hexString(await sha256ByString("abc"))).toBe(
			"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
		);
	});
});

describe("encrypt / decrypt", () => {
	test("暗号化したデータを復号すると元の文字列に戻る", async () => {
		const ivKey = await sha256ByString("secret");
		const plain = JSON.stringify({ rid: 1, data: "日本語を含むデータ" });
		const encrypted = await encrypt(plain, ivKey);
		expect(encrypted).not.toBe(plain);
		expect(await decrypt(encrypted, ivKey)).toBe(plain);
	});

	test("異なる鍵では復号できない", async () => {
		const encrypted = await encrypt(
			"payload",
			await sha256ByString("secret")
		);
		await expect(
			decrypt(encrypted, await sha256ByString("other"))
		).rejects.toThrow();
	});
});

describe("createEncryptionToken", () => {
	test("旧トークンと16進トークンを連結した SHA-256 を返す", async () => {
		const oldToken = new Uint8Array([1, 2, 3]).buffer;
		const expected = await sha256(new Uint8Array([1, 2, 3, 0xab, 0xcd]));
		expect(hexString(await createEncryptionToken(oldToken, "ABcd"))).toBe(
			hexString(expected)
		);
	});
});
