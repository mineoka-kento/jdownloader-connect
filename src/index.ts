import { createMyJDownloaderApis, MyJDownloaderApis } from "./ApiCreators";
import createCallServerEnvironment, { ConnectParams } from "./Connection";

export * from "./ApiStructures";
export type * from "./ApiCreators";

export default async function connectMyJDownloader({
	email,
	password,
	appKey = "myjdownloader-api-key",
	apiVer = 1,
}: ConnectParams): Promise<MyJDownloaderApis> {
	const callServerEnvironment = await createCallServerEnvironment({
		email,
		password,
		appKey,
		apiVer,
	});
	return createMyJDownloaderApis({ appKey }, callServerEnvironment);
}
