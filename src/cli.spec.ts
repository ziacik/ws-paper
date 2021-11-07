import { Paper75HDB } from ".";
import { cli } from "./cli";
import { Drawer } from "./lib/drawer";

jest.mock("./lib/drawer");
jest.mock("./lib/paper75HDB");

describe("cli", () => {
	let drawerClear: jest.Mock;
	let drawerDrawSvg: jest.Mock;
	let deviceInitialize: jest.Mock;
	let deviceFinalize: jest.Mock;

	beforeEach(() => {
		jest.spyOn(console, "log").mockReturnValue();
		jest.spyOn(console, "error").mockReturnValue();
		mockDevice();
		mockDrawer();
	});

	it("can show help", async () => {
		await cli("--help");
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining("--help"));
	});

	it("will show help with zero args", async () => {
		await cli();
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining("--help"));
	});

	it("can show version", async () => {
		await cli("--version");
		expect(console.log).toHaveBeenCalledWith(process.env.npm_package_version);
	});

	describe("clear command", () => {
		it("will clear the device", async () => {
			await cli("clear");
			expect(deviceInitialize).toHaveBeenCalled();
			expect(drawerClear).toHaveBeenCalled();
			expect(drawerClear).toHaveBeenCalledAfter(deviceInitialize);
			expect(deviceFinalize).toHaveBeenCalled();
			expect(deviceFinalize).toHaveBeenCalledAfter(drawerClear);
		});

		it("will finalize the device even if clear fails", async () => {
			drawerClear.mockImplementation(() => {
				throw new Error("Some error");
			});
			await cli("clear");
			expect(deviceFinalize).toHaveBeenCalled();
		});
	});

	describe("draw command", () => {
		it("will show help if no additional argument provided", async () => {
			await cli("draw");
			expect(console.error).toHaveBeenCalledWith(expect.stringContaining("--help"));
		});

		it("will draw svg if svg passed in", async () => {
			await cli("draw", `<svg width="16" height="2"><rect /></svg>`);
			expect(deviceInitialize).toHaveBeenCalled();
			expect(drawerDrawSvg).toHaveBeenCalledWith(`<svg width="16" height="2"><rect /></svg>`);
			expect(drawerDrawSvg).toHaveBeenCalledAfter(deviceInitialize);
			expect(deviceFinalize).toHaveBeenCalled();
			expect(deviceFinalize).toHaveBeenCalledAfter(drawerDrawSvg);
		});

		it("will finalize the device even if drawing fails", async () => {
			drawerDrawSvg.mockImplementation(() => {
				throw new Error("Some error");
			});
			await cli("draw", `<svg width="16" height="2"><rect /></svg>`);
			expect(deviceFinalize).toHaveBeenCalled();
		});
	});

	function mockDrawer(): void {
		const drawerMock = Drawer as jest.Mock;
		drawerClear = jest.fn();
		drawerDrawSvg = jest.fn();
		drawerMock.mockImplementation(() => ({
			clear: async (): Promise<void> => {
				await tick(10);
				drawerClear();
			},
			drawSvg: async (svg: string): Promise<void> => {
				await tick(10);
				drawerDrawSvg(svg);
			},
		}));
	}

	function mockDevice(): void {
		const deviceMock = Paper75HDB as jest.Mock;
		deviceInitialize = jest.fn();
		deviceFinalize = jest.fn();
		deviceMock.mockImplementation(() => ({
			initialize: deviceInitialize,
			finalize: deviceFinalize,
		}));
	}
});

async function tick(time = 0): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}
