import { DeviceStatus } from "./ApiStructures";

export interface ConnectResponse {
	sessiontoken: string;
	regaintoken: string;
	rid: number;
}
export interface ListDevicesResponse {
	list: DeviceBase[];
}
export interface DeviceBase {
	id: string;
	type: "jd";
	name: string;
	status: DeviceStatus;
}
