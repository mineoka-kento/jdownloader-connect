import { defineConfig } from "vite-plus";

export default defineConfig({
	pack: {
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		dts: true,
		sourcemap: true,
		clean: true,
		// README の動作要件に合わせる (Node.js 22 / Baseline Widely Available)
		target: [
			"node22",
			"chrome111",
			"edge111",
			"firefox114",
			"safari16.4",
			"ios16.4",
		],
		// 既存の exports (index.js / index.d.ts) と互換性を保つ
		fixedExtension: false,
		outputOptions: { exports: "named" },
	},
	test: {
		include: ["src/**/*.test.ts"],
	},
	fmt: {
		useTabs: true,
		tabWidth: 4,
		printWidth: 80,
		trailingComma: "es5",
		overrides: [
			{
				files: ["*.yml", "*.yaml"],
				options: { useTabs: false, tabWidth: 2 },
			},
		],
	},
	lint: {
		jsPlugins: [
			{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
		],
		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
			// API はクロージャで構成しており this を使わないため無効化
			"typescript/unbound-method": "off",
		},
		options: { typeAware: true, typeCheck: true },
	},
});
