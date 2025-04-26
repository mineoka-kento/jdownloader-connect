import connectMyJDownloader from "./index";

export type Device = Awaited<
	ReturnType<Awaited<ReturnType<typeof connectMyJDownloader>>["listDevices"]>
> extends (infer T)[]
	? T
	: never;
export const DEVICE_STATUS = {
	UNKNOWN: "UNKNOWN",
} as const;
export type DeviceStatus = (typeof DEVICE_STATUS)[keyof typeof DEVICE_STATUS];

export interface LinkQuery {
	addedDate?: boolean;
	bytesLoaded?: boolean;
	bytesTotal?: boolean;
	comment?: boolean;
	enabled?: boolean;
	eta?: boolean;
	extractionStatus?: boolean;
	finished?: boolean;
	finishedDate?: boolean;
	host?: boolean;
	jobUUIDs?: number[];
	maxResults?: number;
	packageUUIDs?: number[];
	password?: boolean;
	priority?: boolean;
	running?: boolean;
	skipped?: boolean;
	speed?: boolean;
	startAt?: number;
	status?: boolean;
	url?: boolean;
}
export interface DownloadLink {
	addedDate?: number;
	bytesLoaded?: number;
	bytesTotal?: number;
	comment?: string;
	downloadPassword?: string;
	enabled?: boolean;
	eta?: number;
	extractionStatus?: string;
	finished?: boolean;
	finishedDate?: number;
	host?: string;
	name?: string;
	packageUUID?: number;
	priority?: Priority;
	running?: boolean;
	skipped?: boolean;
	speed?: number;
	status?: string;
	statusIconKey?: string;
	url?: string;
	uuid?: number;
}

export interface CrawledLinkQuery {
	availability?: boolean;
	bytesTotal?: boolean;
	comment?: boolean;
	enabled?: boolean;
	host?: boolean;
	jobUUIDs?: number[];
	maxResults?: number;
	packageUUIDs?: number[];
	password?: boolean;
	priority?: boolean;
	startAt?: number;
	status?: boolean;
	url?: boolean;
	variantID?: boolean;
	variantIcon?: boolean;
	variantName?: boolean;
	variants?: boolean;
}
export interface CrawledLink {
	availability?: AvailableLinkState;
	bytesTotal?: number;
	comment?: string;
	downloadPassword?: string;
	enabled?: boolean;
	host?: string;
	name: string;
	packageUUID: number;
	priority?: Priority;
	url?: string;
	uuid: number;
	variant?: LinkVariant;
	variants?: boolean;
}
export interface LinkVariant {
	iconKey: string;
	id: string;
	name: string;
}

export const PRIORITY = {
	HIGHEST: "HIGHEST",
	HIGHER: "HIGHER",
	HIGH: "HIGH",
	DEFAULT: "DEFAULT",
	LOW: "LOW",
	LOWER: "LOWER",
	LOWEST: "LOWEST",
} as const;
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];
export const AVAILABLE_LINK_STATE = {
	ONLINE: "ONLINE",
	OFFLINE: "OFFLINE",
	UNKNOWN: "UNKNOWN",
	TEMP_UNKNOWN: "TEMP_UNKNOWN",
} as const;
export type AvailableLinkState =
	(typeof AVAILABLE_LINK_STATE)[keyof typeof AVAILABLE_LINK_STATE];

export interface DirectConnectionInfos {
	infos: { ip: string; port: number }[];
	mode: "LAN";
	rebindProtectionDetected: boolean;
}

export interface AddLinksQuery {
	assignJobID?: boolean | null;
	autoExtract?: boolean | null;
	autostart?: boolean | null;
	dataURLs?: string[];
	deepDecrypt?: boolean | null;
	destinationFolder?: string;
	downloadPassword?: string;
	extractPassword?: string;
	links?: string;
	overwritePackagizerRules?: boolean | null;
	packageName?: string;
	priority?: Priority;
	sourceUrl?: string;
}
export interface LinkCollectingJob {
	id: number;
}

export interface PackageQuery {
	bytesLoaded?: boolean;
	bytesTotal?: boolean;
	childCount?: boolean;
	comment?: boolean;
	enabled?: boolean;
	eta?: boolean;
	finished?: boolean;
	hosts?: boolean;
	maxResults?: number;
	packageUUIDs?: number[];
	priority?: boolean;
	running?: boolean;
	saveTo?: boolean;
	speed?: boolean;
	startAt?: number;
	status?: boolean;
}
export interface FilePackage {
	activeTask?: string;
	bytesLoaded?: number;
	bytesTotal?: number;
	childCount?: number;
	comment?: string;
	downloadPassword?: string;
	enabled?: boolean;
	eta?: number;
	finished?: boolean;
	hosts?: string[];
	name?: string;
	priority?: Priority;
	running?: boolean;
	saveTo?: string;
	speed?: number;
	status?: string;
	statusIconKey?: string;
	uuid?: number;
}
