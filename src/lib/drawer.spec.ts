import { Device } from "./device";
import { Drawer } from "./drawer";

describe("Drawer", () => {
	let device: Device;
	let drawer: Drawer;

	beforeEach(() => {
		device = {
			width: 16,
			height: 2,
			initialize: jest.fn(),
			finalize: jest.fn(),
			draw: jest.fn(),
		};
		drawer = new Drawer(device);
	});

	describe("clear", () => {
		it("draws an empty image", async () => {
			await drawer.clear();
			expect(device.draw).toHaveBeenCalledWith([0xff, 0xff, 0xff, 0xff], [0, 0, 0, 0]);
		});
	});

	describe("drawSvg", () => {
		it("can render and write basic black & white image", async () => {
			await drawer.drawSvg(`<svg width="16" height="2"><rect width="50%" height="50%" /></svg>`);
			expect(device.draw).toHaveBeenCalledWith([0, 0xff, 0xff, 0xff], [0, 0, 0, 0]);
		});

		it("can render and write basic red & white image", async () => {
			await drawer.drawSvg(`<svg width="16" height="2"><rect width="50%" height="50%" fill="red" /></svg>`);
			expect(device.draw).toHaveBeenCalledWith([0xff, 0xff, 0xff, 0xff], [0xff, 0, 0, 0]);
		});

		it("can render and write basic red & black & white image", async () => {
			await drawer.drawSvg(
				`<svg width="16" height="2">
					<rect width="75%" height="50%" fill="red" />
					<rect x="25%" y="50%" width="75%" height="50%" fill="black" />
				</svg>`
			);
			expect(device.draw).toHaveBeenCalledWith([0xff, 0xff, 0xf0, 0], [0xff, 0xf0, 0, 0]);
		});
	});
});
