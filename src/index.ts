import { createMyJDownloaderApis, MyJDownloaderApis } from "./ApiCreators";
import createCallServerEnvironment, { ConnectParams } from "./Connection";
import { createSerialExecutionEnvironment } from "./SerialExecution";

export * from "./ApiStructures";
export type * from "./ApiCreators";

export default async function connectMyJDownloader({
	email,
	password,
	appKey = "myjdownloader-api-key",
	apiVer = 1,
	delayMs = 500,
}: ConnectParams): Promise<MyJDownloaderApis> {
	const serialExecutionEnvironment =
		createSerialExecutionEnvironment(delayMs);
	const callServerEnvironment = await createCallServerEnvironment({
		email,
		password,
		appKey,
		apiVer,
		serialExecutionEnvironment,
	});
	return createMyJDownloaderApis({ appKey }, callServerEnvironment);
}
