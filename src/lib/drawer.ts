import pixels from "image-pixels";
import render from "svg-render";
import { Device } from "./device";

export class Drawer {
	constructor(private readonly device: Device) {}

	async clear(): Promise<void> {
		const length = (this.device.width * this.device.height) / 8; // TODO handle fractions
		const blackPixels = Array(length).fill(0xff);
		const redPixels = Array(length).fill(0);
		this.device.draw(blackPixels, redPixels);
		this.device.displayOn();
	}

	async drawSvg(svg: string): Promise<void> {
		const outputBuffer = await render({
			buffer: Buffer.from(svg, "utf-8"),
			width: this.device.width,
			height: this.device.height,
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

		this.device.draw(blackBytes, redBytes);
		this.device.displayOn();
	}
}
