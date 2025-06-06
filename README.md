# jdownloader-connect

[![npm version](https://badge.fury.io/js/jdownloader-connect.svg)](https://badge.fury.io/js/jdownloader-connect)
[![npm downloads](https://img.shields.io/npm/dm/jdownloader-connect.svg)](https://www.npmjs.com/package/jdownloader-connect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/mineoka-kento/jdownloader-connect.svg)](https://github.com/mineoka-kento/jdownloader-connect/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mineoka-kento/jdownloader-connect.svg)](https://github.com/mineoka-kento/jdownloader-connect/issues)
[![Build Status](https://github.com/mineoka-kento/jdownloader-connect/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/mineoka-kento/jdownloader-connect/actions)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

> A modern TypeScript/JavaScript client for MyJDownloader API

**jdownloader-connect** is a powerful and easy-to-use library that allows you to interact with JDownloader2 remotely through the MyJDownloader service. Control your downloads, manage link grabber, and monitor your JDownloader instances from Node.js applications or web browsers.

## ✨ Features

-   🚀 **Modern TypeScript/JavaScript API** - Fully typed with excellent IDE support
-   🌐 **Cross-platform** - Works in Node.js and modern browsers
-   🔐 **Secure Authentication** - Uses MyJDownloader's official encryption protocols
-   📱 **Device Management** - List and control multiple JDownloader instances
-   🔗 **Link Management** - Add links, manage downloads, and control the link grabber
-   ⚡ **Promise-based** - Modern async/await support
-   🛡️ **Type Safety** - Complete TypeScript definitions included

## 📦 Installation

### Using npm

```bash
npm install jdownloader-connect
```

### Using yarn

```bash
yarn add jdownloader-connect
```

### Using pnpm

```bash
pnpm add jdownloader-connect
```

## 🚀 Quick Start

```typescript
import connectMyJDownloader from "jdownloader-connect";

async function main() {
	// Connect to MyJDownloader
	const { listDevices, disconnect } = await connectMyJDownloader({
		email: "your-email@example.com",
		password: "your-password",
	});

	try {
		// Get available devices
		const devices = await listDevices();
		console.log(`Found ${devices.length} device(s)`);

		// Use the first available device
		const device = devices[0];

		// Add links to the link grabber
		await device.linkGrabberAddLinks({
			links: "https://example.com/file.zip",
		});

		console.log("Links added successfully!");
	} finally {
		// Always disconnect when done
		await disconnect();
	}
}

main().catch(console.error);
```

## 📚 API Reference

### Connection

#### `connectMyJDownloader(options)`

Establishes a connection to MyJDownloader service.

**Parameters:**

-   `email` (string): Your MyJDownloader email
-   `password` (string): Your MyJDownloader password
-   `appKey` (string, optional): Application key (default: "myjdownloader-api-key")
-   `apiVer` (number, optional): API version (default: 1)

**Returns:** `Promise<MyJDownloaderApis>`

### Device Management

#### `listDevices()`

Lists all available JDownloader devices connected to your account.

**Returns:** `Promise<Device[]>`

#### `reconnect()`

Reconnects to the MyJDownloader service (useful for handling session timeouts).

**Returns:** `Promise<void>`

#### `disconnect()`

Cleanly disconnects from the MyJDownloader service.

**Returns:** `Promise<void>`

### Link Management

#### `device.linkGrabberAddLinks(options)`

Adds links to the link grabber.

**Parameters:**

-   `links` (string): URLs to add (space or newline separated)
-   `packageName` (string, optional): Package name for grouping
-   `extractPassword` (string, optional): Password for archives
-   `priority` (string, optional): Download priority
-   `downloadPassword` (string, optional): Download password
-   `destinationFolder` (string, optional): Destination folder
-   `comment` (string, optional): Comment for the links

**Returns:** `Promise<void>`

#### `device.linkGrabberQueryLinks(query?)`

Queries links in the link grabber.

**Parameters:**

-   `query` (CrawledLinkQuery, optional): Query parameters for filtering

**Returns:** `Promise<CrawledLink[]>`

#### `device.downloadsQueryLinks(query?)`

Queries active/completed downloads.

**Parameters:**

-   `query` (LinkQuery, optional): Query parameters for filtering

**Returns:** `Promise<DownloadLink[]>`

## ⚙️ Requirements

-   **Node.js**: 18.0.0 or higher
-   **Browser**: Modern browsers with Web Crypto API support
    -   Chrome 63+, Firefox 57+, Safari 11.1+, Edge 79+
    -   Requires HTTPS context for Web Crypto API usage

### Platform Compatibility Details

This library requires the following APIs across all platforms:

-   **Web Crypto API** (`crypto.subtle`) - for encryption and authentication
-   **Fetch API** (`fetch`) - for HTTP requests
-   **TextEncoder/TextDecoder** - for UTF-8 encoding/decoding
-   **URLSearchParams** - for URL parameter handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Thanks to the JDownloader team for providing the MyJDownloader API
-   Inspired by the need for a modern, type-safe JDownloader client

## 📞 Support

-   🐛 **Bug Reports**: [GitHub Issues](https://github.com/mineoka-kento/jdownloader-connect/issues)
-   💡 **Feature Requests**: [GitHub Issues](https://github.com/mineoka-kento/jdownloader-connect/issues)

---

**Note**: This library is not officially affiliated with JDownloader. It's a community-created client for the MyJDownloader API.
