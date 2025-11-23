import fs from "node:fs/promises";

const root = "./src";
const outdir = "./out";
const dirs = ["script", "css"];
const files = [];

for (const dir of dirs) {
	const pathes = (await fs.readdir(`${root}/${dir}`)).map(
		(fileName) => `${root}/${dir}/${fileName}`,
	);
	files.push(...pathes);
}

console.log(
	await Bun.build({
		entrypoints: files,
		outdir,
		minify: true,
	}),
);

// fs.cp(`${root}/css/`, `${outdir}/css/`, { recursive: true });
fs.cp(`${root}/manifest.json`, `${outdir}/manifest.json`);
