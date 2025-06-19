export function createSerialExecutionEnvironment(
	delayMs: number = 0
): <Result>(fn: () => Promise<Result>) => Promise<Result> {
	let executing: Promise<unknown> | null = null;
	return async <Result>(fn: () => Promise<Result>): Promise<Result> => {
		while (executing != null) {
			try {
				await executing;
			} catch {}
		}
		const ret = fn();
		executing = (async () => {
			try {
				await ret;
			} finally {
				// 指定した時間後にexecutingをnullにする
				if (delayMs > 0) {
					await new Promise((resolve) =>
						setTimeout(resolve, delayMs)
					);
				}
				executing = null;
			}
		})();
		return ret;
	};
}
