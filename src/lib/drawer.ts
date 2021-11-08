import pixels from "image-pixels";
import render from "svg-render";
import { Device } from "./device";

/**
 * Class for high-level drawing on a device.
 */
export class Drawer {
	/**
	 * Creates a Drawer instance.
	 * @param device specific device implementation to be used as an underlying hardware for drawing to
	 */
	constructor(private readonly device: Device) {}

	/**
	 * Clears the device.
	 */
	async clear(): Promise<void> {
		const length = (this.device.width * this.device.height) / 8; // TODO handle fractions
		const blackPixels = Array(length).fill(0xff);
		const redPixels = Array(length).fill(0);
		this.device.draw(blackPixels, redPixels);
	}

	/**
	 * Draws a svg image on the device.
	 * @param svg A svg which is to be drawed to the device.
	 */
	async drawSvg(svg: string): Promise<void> {
		const outputBuffer = await render({
			buffer: Buffer.from(svg, "utf-8"),
			width: this.device.width,
			height: this.device.height,
		});

		const { data } = await pixels(outputBuffer);

		const blackBytes = [];
		const redBytes = [];

		let offset = 128;
		let blackByte = 0;
		let redByte = 0;

		for (let i = 0; i < data.length; i += 4) {
			const [r, g, b, a] = data.slice(i, i + 4);
			const isBlack = r === 0 && g === 0 && b === 0 && a === 255;
			const isRed = r === 255 && g === 0 && b === 0 && a === 255;

			blackByte += isBlack ? 0 : offset;
			redByte += isRed ? 0 : offset;

			offset = offset >> 1;

			if (offset === 0) {
				blackBytes.push(blackByte);
				redBytes.push(redByte ^ 0xff);
				blackByte = 0;
				redByte = 0;
				offset = 128;
			}
		}

		this.device.draw(blackBytes, redBytes);
	}
}
