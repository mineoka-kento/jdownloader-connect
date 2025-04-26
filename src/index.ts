import {
	AddLinksQuery,
	CrawledLink,
	CrawledLinkQuery,
	DirectConnectionInfos,
	DownloadLink,
	FilePackage,
	LinkCollectingJob,
	LinkQuery,
	PackageQuery,
} from "./ApiStructures";
import createCallServerEnvironment, { ConnectParams } from "./Connection";
import { createEncryptionToken } from "./Crypto";
import { ConnectResponse, ListDevicesResponse } from "./ResponseStructures";

export * from "./ApiStructures";

export default async function connectMyJDownloader({
	email,
	password,
	appKey = "myjdownloader-api-key",
	apiVer = 1,
}: ConnectParams) {
	const {
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
	} = await createCallServerEnvironment({ email, password, appKey, apiVer });

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
		async listDevices() {
			const { list }: ListDevicesResponse = await callServer(
				"/my/listdevices",
				getServerEncryptionToken(),
				{
					sessiontoken: getSessionToken(),
				}
			);
			return list.map((device) => {
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
						return callDevice(
							"/device/getDirectConnectionInfos",
							deviceId
						);
					},
					async linkGrabberAddLinks(
						options: AddLinksQuery = {}
					): Promise<LinkCollectingJob> {
						return callDevice("/linkgrabberv2/addLinks", options);
					},
					async downloadsQueryPackages(
						options: PackageQuery = {}
					): Promise<FilePackage[]> {
						return callDevice(
							"/downloadsV2/queryPackages",
							options
						);
					},
				} as const;
			});
		},
	} as const;
}
