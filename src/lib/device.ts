export type PixelSize = number;
export type Pixel = number;

export interface Device {
	readonly width: PixelSize;
	readonly height: PixelSize;
	initialize(): void;
	finalize(): void;
	draw(blackPixels: Pixel[], redPixels: Pixel[]): void;
	displayOn(): void;
}
