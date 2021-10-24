export type PixelSize = number;
export type Pixel8 = number;

export interface Device {
	readonly width: PixelSize;
	readonly height: PixelSize;
	initialize(): void;
	finalize(): void;
	draw(blackPixels: Pixel8[], redPixels: Pixel8[]): void;
}
