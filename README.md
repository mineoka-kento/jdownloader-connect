# jdownloader-connect

JDownloader client for Node.js and Browser, written in TypeScript.

## Installation

```
npm i --save jdownloader-connect
```

## Usage

```
import connectMyJDownloader from "jdownloader-connect";

async function main() {
	const { listDevices, disconnect } = await connectMyJDownloader({
		email: "EMAIL",
		password: "PASSWORD",
	});
	try {
		const deviceList = await listDevices();
		await deviceList[0].linkGrabberAddLinks({
			links: "URL",
		});
	} finally {
		await disconnect();
	}
}
```
