/**
 * Defines a size of something in pixels.
 */
export type PixelSize = number;

/**
 * Eight pixels in one byte. Each pixel is one bit, meaning it's either on or off.
 */
export type Pixel8 = number;

/**
 * An interface for specific paper device implementations.
 */
export interface Device {
	readonly width: PixelSize;
	readonly height: PixelSize;

	/**
	 * Initializes the device, i.e. sends commands necessary to prepare the device for drawing.
	 */
	initialize(): void;

	/**
	 * Finalizes the device, i.e. puts the device to sleep and does everything needed to leave the device in proper state.
	 */
	finalize(): void;

	/**
	 * Draws an image to the device.
	 * @param blackPixels an array of black pixels to draw
	 * @param redPixels an array of red pixels to draw
	 */
	draw(blackPixels: Pixel8[], redPixels: Pixel8[]): void;
}
