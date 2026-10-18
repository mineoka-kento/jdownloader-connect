import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { createSerialExecutionEnvironment } from "./SerialExecution";

function deferred() {
	let resolve!: () => void;
	const promise = new Promise<void>((r) => {
		resolve = r;
	});
	return { promise, resolve };
}

describe("createSerialExecutionEnvironment", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	test("前の処理が終わるまで次の処理を開始しない", async () => {
		const serial = createSerialExecutionEnvironment();
		const events: string[] = [];
		const first = deferred();

		const p1 = serial(async () => {
			events.push("start1");
			await first.promise;
			events.push("end1");
			return 1;
		});
		const p2 = serial(async () => {
			events.push("start2");
			return 2;
		});

		await Promise.resolve();
		expect(events).toEqual(["start1"]);

		first.resolve();
		expect(await Promise.all([p1, p2])).toEqual([1, 2]);
		expect(events).toEqual(["start1", "end1", "start2"]);
	});

	test("前の処理が失敗しても次の処理は実行される", async () => {
		const serial = createSerialExecutionEnvironment();
		const p1 = serial(async () => {
			throw new Error("failed");
		});
		const p2 = serial(async () => "ok");

		await expect(p1).rejects.toThrow("failed");
		await expect(p2).resolves.toBe("ok");
	});

	test("delayMs 経過するまで次の処理を開始しない", async () => {
		vi.useFakeTimers();
		const serial = createSerialExecutionEnvironment(500);
		const fn = vi.fn(async () => "second");

		await serial(async () => "first");
		const p2 = serial(fn);

		await vi.advanceTimersByTimeAsync(499);
		expect(fn).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(1);
		await expect(p2).resolves.toBe("second");
		expect(fn).toHaveBeenCalledOnce();
	});
});
