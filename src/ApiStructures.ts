export const ERROR_SOURCES = {
	DEVICE: "DEVICE",
	MYJD: "MYJD",
} as const;
export type ErrorSource = (typeof ERROR_SOURCES)[keyof typeof ERROR_SOURCES];

export const SERVER_ERROR_TYPES = {
	MAINTENANCE: "MAINTENANCE",
	OVERLOAD: "OVERLOAD",
	TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
	ERROR_EMAIL_NOT_CONFIRMED: "ERROR_EMAIL_NOT_CONFIRMED",
	OUTDATED: "OUTDATED",
	TOKEN_INVALID: "TOKEN_INVALID",
	OFFLINE: "OFFLINE",
	UNKNOWN: "UNKNOWN",
	BAD_REQUEST: "BAD_REQUEST",
	AUTH_FAILED: "AUTH_FAILED",
	EMAIL_INVALID: "EMAIL_INVALID",
	CHALLENGE_FAILED: "CHALLENGE_FAILED",
	METHOD_FORBIDDEN: "METHOD_FORBIDDEN",
	EMAIL_FORBIDDEN: "EMAIL_FORBIDDEN",
	FAILED: "FAILED",
	STORAGE_NOT_FOUND: "STORAGE_NOT_FOUND",
	STORAGE_LIMIT_REACHED: "STORAGE_LIMIT_REACHED",
	STORAGE_ALREADY_EXISTS: "STORAGE_ALREADY_EXISTS",
	STORAGE_INVALID_KEY: "STORAGE_INVALID_KEY",
	STORAGE_KEY_NOT_FOUND: "STORAGE_KEY_NOT_FOUND",
	STORAGE_INVALID_STORAGEID: "STORAGE_INVALID_STORAGEID",
} as const;
export type ServerErrorType =
	(typeof SERVER_ERROR_TYPES)[keyof typeof SERVER_ERROR_TYPES];

export const DEVICE_ERROR_TYPES = {
	SESSION: "SESSION",
	API_COMMAND_NOT_FOUND: "API_COMMAND_NOT_FOUND",
	AUTH_FAILED: "AUTH_FAILED",
	FILE_NOT_FOUND: "FILE_NOT_FOUND",
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	API_INTERFACE_NOT_FOUND: "API_INTERFACE_NOT_FOUND",
	BAD_PARAMETERS: "BAD_PARAMETERS",
} as const;
export type DeviceErrorType =
	(typeof DEVICE_ERROR_TYPES)[keyof typeof DEVICE_ERROR_TYPES];

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

export const CLEANUP_ACTION = {
	DELETE_DISABLED_LINKS: "DELETE_DISABLED_LINKS",
	DELETE_FAILED_LINKS: "DELETE_FAILED_LINKS",
	DELETE_FINISHED_LINKS: "DELETE_FINISHED_LINKS",
	DELETE_OFFLINE_LINKS: "DELETE_OFFLINE_LINKS",
	DELETE_ALL_LINKS: "DELETE_ALL_LINKS",
	RECYCLE_DISABLED_LINKS: "RECYCLE_DISABLED_LINKS",
	RECYCLE_FAILED_LINKS: "RECYCLE_FAILED_LINKS",
	RECYCLE_FINISHED_LINKS: "RECYCLE_FINISHED_LINKS",
	RECYCLE_OFFLINE_LINKS: "RECYCLE_OFFLINE_LINKS",
	RECYCLE_ALL_LINKS: "RECYCLE_ALL_LINKS",
} as const;
export type CleanupAction =
	(typeof CLEANUP_ACTION)[keyof typeof CLEANUP_ACTION];

export const SELECTION_TYPE = {
	ALL: "ALL",
	SELECTED: "SELECTED",
	UNSELECTED: "UNSELECTED",
	VISIBLE: "VISIBLE",
} as const;
export type SelectionType =
	(typeof SELECTION_TYPE)[keyof typeof SELECTION_TYPE];

export interface SystemInfos {
	osName: string;
	osVersion: string;
	osArch: string;
	javaVersion: string;
	javaVendor: string;
	javaVMName: string;
	javaVMVersion: string;
	headLess: boolean;
	jre: string;
}

export interface StorageInfo {
	path: string;
	size: number;
	free: number;
	isFileSystem: boolean;
}

export interface RemoveLinksQuery {
	linkIds?: number[];
	packageIds?: number[];
}

export interface ForceDownloadQuery {
	linkIds?: number[];
	packageIds?: number[];
}

export interface SetEnabledQuery {
	enabled: boolean;
	linkIds?: number[];
	packageIds?: number[];
}

export interface MoveToDownloadlistQuery {
	linkIds?: number[];
	packageIds?: number[];
}

export interface StartDownloadsQuery {
	linkIds?: number[];
	packageIds?: number[];
}

export interface MovePackagesQuery {
	packageIds: number[];
	afterDestPackageId: number;
}

export interface SetPriorityQuery {
	priority: Priority;
	linkIds?: number[];
	packageIds?: number[];
}

export interface CleanupQuery {
	linkIds?: number[];
	packageIds?: number[];
	action?: CleanupAction;
	mode?:
		| "REMOVE_LINKS_ONLY"
		| "REMOVE_LINKS_AND_DELETE_FILES"
		| "REMOVE_LINKS_AND_RECYCLE_FILES";
	selector?: SelectionType;
}
