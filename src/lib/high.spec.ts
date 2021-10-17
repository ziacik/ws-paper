import { drawSvg } from "./high";
import { draw } from "./low";
jest.mock("./low");

describe("high level functions", () => {
	beforeEach(() => {
		(draw as jest.Mock).mockImplementation();
	});

	describe("drawSvg", () => {
		it("can render and write basic black & white image", async () => {
			await drawSvg(`<svg width="16" height="2"><rect width="50%" height="50%" /></svg>`);
			expect(draw).toHaveBeenCalledWith([0xff, 0, 0, 0], [0, 0, 0, 0]);
		});

		it("can render and write basic red & white image", async () => {
			await drawSvg(`<svg width="16" height="2"><rect width="50%" height="50%" fill="red" /></svg>`);
			expect(draw).toHaveBeenCalledWith([0, 0, 0, 0], [0xff, 0, 0, 0]);
		});

		it("can render and write basic red & black & white image", async () => {
			await drawSvg(
				`<svg width="16" height="2">
					<rect width="50%" height="50%" fill="red" />
					<rect x="50%" y="50%" width="50%" height="50%" fill="black" />
				</svg>`
			);
			expect(draw).toHaveBeenCalledWith([0, 0, 0, 0xff], [0xff, 0, 0, 0]);
		});
	});
});
