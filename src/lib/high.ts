import pixels from "image-pixels";
import render from "svg-render";
import { draw } from "./low";

export async function drawSvg(svg: string): Promise<void> {
	const outputBuffer = await render({
		buffer: Buffer.from(svg, "utf-8"),
	});

	const { data } = await pixels(outputBuffer);

	const blackBytes = [];
	const redBytes = [];

	let offset = 1;
	let blackByte = 0;
	let redByte = 0;

	for (let i = 0; i < data.length; i += 4) {
		const [r, g, b, a] = data.slice(i, i + 4);
		const isBlack = r === 0 && g === 0 && b === 0 && a === 255;
		const isRed = r === 255 && g === 0 && b === 0 && a === 255;

		blackByte += isBlack ? offset : 0;
		redByte += isRed ? offset : 0;

		offset *= 2;

		if (offset === 256) {
			blackBytes.push(blackByte);
			redBytes.push(redByte);
			blackByte = 0;
			redByte = 0;
			offset = 1;
		}
	}

	draw(blackBytes, redBytes);
}
