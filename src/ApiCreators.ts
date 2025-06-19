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
	callServerEnvironment: Awaited<
		ReturnType<typeof createCallServerEnvironment>
	>
) {
	return {
		async reconnect(): Promise<void> {
			const {
				sessiontoken: sessionTokenResult,
				regaintoken: regainTokenResult,
			}: ConnectResponse = await callServerEnvironment.callServer(
				"/my/reconnect",
				callServerEnvironment.getServerEncryptionToken(),
				{
					appkey: appKey,
					sessiontoken: callServerEnvironment.getSessionToken(),
					regaintoken: callServerEnvironment.getRegainToken(),
				}
			);
			callServerEnvironment.setSessionToken(sessionTokenResult);
			callServerEnvironment.setRegainToken(regainTokenResult);
			callServerEnvironment.setServerEncryptionToken(
				await createEncryptionToken(
					callServerEnvironment.getServerEncryptionToken(),
					callServerEnvironment.getSessionToken()
				)
			);
			callServerEnvironment.setDeviceEncryptionToken(
				await createEncryptionToken(
					callServerEnvironment.getDeviceSecret(),
					callServerEnvironment.getSessionToken()
				)
			);
		},
		async disconnect(): Promise<void> {
			await callServerEnvironment.callServer(
				"/my/disconnect",
				callServerEnvironment.getServerEncryptionToken(),
				{
					sessiontoken: callServerEnvironment.getSessionToken(),
				}
			);
		},
		async listDevices(): Promise<DeviceApis[]> {
			const { list }: ListDevicesResponse =
				await callServerEnvironment.callServer(
					"/my/listdevices",
					callServerEnvironment.getServerEncryptionToken(),
					{
						sessiontoken: callServerEnvironment.getSessionToken(),
					}
				);
			return list.map<DeviceApis>((device) =>
				createDeviceApis(callServerEnvironment, device)
			);
		},
	} as const;
}

// Helper to avoid repeating API method definitions.
function createDeviceApiSet(
	callDeviceFn: (query: string, params?: unknown) => Promise<any>
) {
	return {
		// ### /downloadsV2 methods ###
		downloadsQueryLinks(options: LinkQuery = {}): Promise<DownloadLink[]> {
			return callDeviceFn("/downloadsV2/queryLinks", options);
		},
		downloadsQueryPackages(
			options: PackageQuery = {}
		): Promise<FilePackage[]> {
			return callDeviceFn("/downloadsV2/queryPackages", options);
		},
		downloadsSetEnabled(options: SetEnabledQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/setEnabled", options);
		},
		downloadsRemoveLinks(options: RemoveLinksQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/removeLinks", options);
		},
		downloadsForceDownload(options: ForceDownloadQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/forceDownload", options);
		},
		downloadsCleanup(options: CleanupQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/cleanup", options);
		},
		downloadsMovePackages(options: MovePackagesQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/movePackages", options);
		},
		downloadsSetPriority(options: SetPriorityQuery): Promise<void> {
			return callDeviceFn("/downloadsV2/setPriority", options);
		},

		// ### /linkgrabberv2 methods ###
		linkGrabberQueryLinks(
			options: CrawledLinkQuery = {}
		): Promise<CrawledLink[]> {
			return callDeviceFn("/linkgrabberv2/queryLinks", options);
		},
		linkGrabberAddLinks(
			options: AddLinksQuery = {}
		): Promise<LinkCollectingJob> {
			return callDeviceFn("/linkgrabberv2/addLinks", options);
		},
		linkGrabberMoveToDownloadlist(
			options: MoveToDownloadlistQuery = {}
		): Promise<void> {
			return callDeviceFn("/linkgrabberv2/moveToDownloadlist", options);
		},
		linkGrabberClearList(): Promise<void> {
			return callDeviceFn("/linkgrabberv2/clearList");
		},
		linkGrabberRemoveLinks(options: RemoveLinksQuery): Promise<void> {
			return callDeviceFn("/linkgrabberv2/removeLinks", options);
		},
		linkGrabberStartDownloads(
			options: StartDownloadsQuery = {}
		): Promise<void> {
			return callDeviceFn("/linkgrabberv2/startDownloads", options);
		},
		linkGrabberSetEnabled(options: SetEnabledQuery): Promise<void> {
			return callDeviceFn("/linkgrabberv2/setEnabled", options);
		},

		// ### /system methods ###
		getSystemInfos(): Promise<SystemInfos> {
			return callDeviceFn("/system/getSystemInfos");
		},
		getStorageInfos(path: string = "/"): Promise<StorageInfo[]> {
			return callDeviceFn("/system/getStorageInfos", { path });
		},
		restartJD(): Promise<void> {
			return callDeviceFn("/system/restartJD");
		},
		shutdownOS(): Promise<void> {
			return callDeviceFn("/system/shutdownOS");
		},

		// ### /device methods ###
		getSessionPublicKey(): Promise<string> {
			return callDeviceFn("/device/getSessionPublicKey");
		},
		ping(): Promise<"pong"> {
			return callDeviceFn("/device/ping");
		},
	};
}

// The base set of device APIs, without connection-switching methods.
type BaseDeviceApiSet = ReturnType<typeof createDeviceApiSet>;

/**
 * A set of APIs for controlling a device directly, without the MyJDownloader proxy.
 * Inherits device information and the base API set.
 */
export type DirectDeviceApis = DeviceBase & BaseDeviceApiSet;

/**
 * A set of APIs for a device connected via the MyJDownloader proxy.
 * Includes methods to switch to a direct connection.
 */
export type DeviceApis = DeviceBase &
	BaseDeviceApiSet & {
		getDirectConnectionInfos(): Promise<DirectConnectionInfos>;
		connectDirectly(): Promise<DirectDeviceApis>;
	};

function createDeviceApis(
	callServerEnvironment: Awaited<
		ReturnType<typeof createCallServerEnvironment>
	>,
	device: DeviceBase
): DeviceApis {
	const deviceId = device.id;
	const { callDevice } =
		callServerEnvironment.createCallDeviceEnvironment(deviceId);
	const apiSet = createDeviceApiSet(callDevice);

	// The full device API object, conforming to the DeviceApis type.
	const deviceApis: DeviceApis = {
		...device,
		...apiSet,
		getDirectConnectionInfos(): Promise<DirectConnectionInfos> {
			return callDevice("/device/getDirectConnectionInfos");
		},
		async connectDirectly(): Promise<DirectDeviceApis> {
			const connectionInfos = await this.getDirectConnectionInfos();
			if (!connectionInfos || connectionInfos.infos.length === 0) {
				throw new Error(
					"Direct connection not available for this device (no connection info found)."
				);
			}

			// Try to connect to each available IP address.
			const errors: { address: string; error: unknown }[] = [];
			for (const info of connectionInfos.infos) {
				const { ip, port } = info;

				for (const directEndpoint of [
					`https://${ip
						.split(".")
						.join("-")}.mydns.jdownloader.org:${port}`,
					`http://${ip}:${port}`,
				]) {
					try {
						console.log(
							`Attempting direct connection to ${directEndpoint}...`
						);
						const { callDeviceDirect } =
							callServerEnvironment.createCallDeviceDirectEnvironment(
								directEndpoint
							);

						// Test the connection with a simple ping.
						await callDeviceDirect("/device/ping");
						console.log(
							`Direct connection to ${directEndpoint} successful!`
						);

						// If successful, create and return the direct API set.
						const directApiSet =
							createDeviceApiSet(callDeviceDirect);
						return {
							...device,
							...directApiSet,
						};
					} catch (error) {
						console.warn(
							`Failed to connect directly to ${directEndpoint}.`
						);
						errors.push({ address: directEndpoint, error });
					}
				}
			}

			// If the loop completes, all attempts have failed.
			console.error("All direct connection attempts failed.", errors);
			throw new Error(
				`Failed to establish a direct connection. Tried ${connectionInfos.infos.length} address(es).`
			);
		},
	};
	return deviceApis;
}
