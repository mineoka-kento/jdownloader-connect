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
} from ".";
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
		async listDevices(): Promise<Device[]> {
			const { list }: ListDevicesResponse = await callServer(
				"/my/listdevices",
				getServerEncryptionToken(),
				{
					sessiontoken: getSessionToken(),
				}
			);
			return list.map<Device>((device) =>
				createDeviceApis({ createCallDeviceEnvironment }, device)
			);
		},
	} as const;
}

export type Device = ReturnType<typeof createDeviceApis>;
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
	} as const;
}
