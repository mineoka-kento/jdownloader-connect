import {
	LinkQuery,
	DownloadLink,
	CrawledLinkQuery,
	CrawledLink,
	DirectConnectionInfos,
	AddLinksQuery,
	LinkCollectingJob,
	PackageQuery,
	FilePackage,
	SystemInfos,
	StorageInfo,
	RemoveLinksQuery,
	ForceDownloadQuery,
	SetEnabledQuery,
	MoveToDownloadlistQuery,
	StartDownloadsQuery,
	MovePackagesQuery,
	SetPriorityQuery,
	CleanupQuery,
} from "./ApiStructures";
import createCallServerEnvironment, { ConnectParams } from "./Connection";
import { createEncryptionToken } from "./Crypto";
import {
	ConnectResponse,
	DeviceBase,
	ListDevicesResponse,
} from "./ResponseStructures";

export type MyJDownloaderApis = ReturnType<typeof createMyJDownloaderApis>;
export function createMyJDownloaderApis(
	{ appKey }: Pick<Required<ConnectParams>, "appKey">,
	{
		callServer,
		getDeviceSecret,
		getSessionToken,
		setSessionToken,
		getRegainToken,
		setRegainToken,
		getServerEncryptionToken,
		setServerEncryptionToken,
		setDeviceEncryptionToken,
		createCallDeviceEnvironment,
	}: Awaited<ReturnType<typeof createCallServerEnvironment>>
) {
	return {
		async reconnect(): Promise<void> {
			const {
				sessiontoken: sessionTokenResult,
				regaintoken: regainTokenResult,
			}: ConnectResponse = await callServer(
				"/my/reconnect",
				getServerEncryptionToken(),
				{
					appkey: appKey,
					sessiontoken: getSessionToken(),
					regaintoken: getRegainToken(),
				}
			);
			setSessionToken(sessionTokenResult);
			setRegainToken(regainTokenResult);
			setServerEncryptionToken(
				await createEncryptionToken(
					getServerEncryptionToken(),
					getSessionToken()
				)
			);
			setDeviceEncryptionToken(
				await createEncryptionToken(
					getDeviceSecret(),
					getSessionToken()
				)
			);
		},
		async disconnect(): Promise<void> {
			await callServer("/my/disconnect", getServerEncryptionToken(), {
				sessiontoken: getSessionToken(),
			});
		},
		async listDevices(): Promise<DeviceApis[]> {
			const { list }: ListDevicesResponse = await callServer(
				"/my/listdevices",
				getServerEncryptionToken(),
				{
					sessiontoken: getSessionToken(),
				}
			);
			return list.map<DeviceApis>((device) =>
				createDeviceApis({ createCallDeviceEnvironment }, device)
			);
		},
	} as const;
}

export type DeviceApis = ReturnType<typeof createDeviceApis>;
function createDeviceApis(
	{
		createCallDeviceEnvironment,
	}: Pick<
		Awaited<ReturnType<typeof createCallServerEnvironment>>,
		"createCallDeviceEnvironment"
	>,
	device: DeviceBase
) {
	const deviceId = device.id;
	const { callDevice } = createCallDeviceEnvironment(deviceId);
	return {
		...device,
		async downloadsQueryLinks(
			options: LinkQuery = {}
		): Promise<DownloadLink[]> {
			return callDevice("/downloadsV2/queryLinks", options);
		},
		async linkGrabberQueryLinks(
			options: CrawledLinkQuery = {}
		): Promise<CrawledLink[]> {
			return callDevice("/linkgrabberv2/queryLinks", options);
		},
		async getDirectConnectionInfos(): Promise<DirectConnectionInfos> {
			return callDevice("/device/getDirectConnectionInfos", deviceId);
		},
		async linkGrabberAddLinks(
			options: AddLinksQuery = {}
		): Promise<LinkCollectingJob> {
			return callDevice("/linkgrabberv2/addLinks", options);
		},
		async downloadsQueryPackages(
			options: PackageQuery = {}
		): Promise<FilePackage[]> {
			return callDevice("/downloadsV2/queryPackages", options);
		},

		// ### /device methods ###
		async getSessionPublicKey(): Promise<string> {
			return callDevice("/device/getSessionPublicKey");
		},
		async ping(): Promise<"pong"> {
			return callDevice("/device/ping");
		},

		// ### /downloadsV2 methods ###
		async downloadsSetEnabled(options: SetEnabledQuery): Promise<void> {
			return callDevice("/downloadsV2/setEnabled", options);
		},
		async downloadsRemoveLinks(options: RemoveLinksQuery): Promise<void> {
			return callDevice("/downloadsV2/removeLinks", options);
		},
		async downloadsForceDownload(
			options: ForceDownloadQuery
		): Promise<void> {
			return callDevice("/downloadsV2/forceDownload", options);
		},
		async downloadsCleanup(options: CleanupQuery): Promise<void> {
			return callDevice("/downloadsV2/cleanup", options);
		},
		async downloadsMovePackages(options: MovePackagesQuery): Promise<void> {
			return callDevice("/downloadsV2/movePackages", options);
		},
		async downloadsSetPriority(options: SetPriorityQuery): Promise<void> {
			return callDevice("/downloadsV2/setPriority", options);
		},

		// ### /linkgrabberv2 methods ###
		async linkGrabberMoveToDownloadlist(
			options: MoveToDownloadlistQuery = {}
		): Promise<void> {
			return callDevice("/linkgrabberv2/moveToDownloadlist", options);
		},
		async linkGrabberClearList(): Promise<void> {
			return callDevice("/linkgrabberv2/clearList");
		},
		async linkGrabberRemoveLinks(options: RemoveLinksQuery): Promise<void> {
			return callDevice("/linkgrabberv2/removeLinks", options);
		},
		async linkGrabberStartDownloads(
			options: StartDownloadsQuery = {}
		): Promise<void> {
			return callDevice("/linkgrabberv2/startDownloads", options);
		},
		async linkGrabberSetEnabled(options: SetEnabledQuery): Promise<void> {
			return callDevice("/linkgrabberv2/setEnabled", options);
		},

		// ### /system methods ###
		async getSystemInfos(): Promise<SystemInfos> {
			return callDevice("/system/getSystemInfos");
		},
		async getStorageInfos(path: string = "/"): Promise<StorageInfo[]> {
			return callDevice("/system/getStorageInfos", { path });
		},
		async restartJD(): Promise<void> {
			return callDevice("/system/restartJD");
		},
		async shutdownOS(): Promise<void> {
			return callDevice("/system/shutdownOS");
		},
	} as const;
}
