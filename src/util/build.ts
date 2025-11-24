import fs from "node:fs/promises";

const root = "./src";
const outdir = "./out";

await fs.rm(`${outdir}/`, { recursive: true, force: true });
await fs.mkdir(outdir);

console.log(
	await Bun.build({
		entrypoints: [`${root}/script/index.ts`, `${root}/css/common.css`],
		outdir,
		minify: true,
	}),
);

await fs.cp(`${root}/manifest.json`, `${outdir}/manifest.json`);
