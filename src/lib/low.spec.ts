import {
	init,
	INPUT,
	LOW,
	mode,
	msleep,
	OUTPUT,
	spiBegin,
	spiChipSelect,
	spiSetClockDivider,
	spiSetCSPolarity,
	spiSetDataMode,
	spiWrite,
	write,
	read,
} from "rpio";
import { initialize, Pin } from "./low";

jest.mock("rpio");

describe("low level functions", () => {
	let initOptions: Record<string, unknown>;
	let modes: Record<Pin, number>;
	let commands: string[];

	beforeEach(() => {
		modes = {} as Record<Pin, number>;
		initOptions = {};
		commands = [];
		(init as jest.Mock).mockImplementation((options: Record<string, unknown>) => (initOptions = options));
		(mode as jest.Mock).mockImplementation((pin: Pin, mode: number) => (modes[pin] = mode));
		(write as jest.Mock).mockImplementation((pin: Pin, value: number) => commands.push(`${Pin[pin]}${value.toString(16)}`));
		(msleep as jest.Mock).mockImplementation((delay: number) => commands.push(`~${delay}`));
		(spiWrite as jest.Mock).mockImplementation((buffer: Buffer, len: number) => {
			const values = Array(len)
				.fill(0)
				.map((_val, i) => buffer.readUInt8(i).toString(16));
			commands.push(`:${values.join(",")}`);
		});
		(read as jest.Mock).mockImplementation((pin: Pin) => {
			commands.push(`?${Pin[pin]}`);
			return 0;
		});
	});

	describe("initialize", () => {
		it("initializes rpio with gpiomem = false and gpio mappings", () => {
			initialize();
			expect(initOptions).toEqual({
				gpiomem: false,
				mapping: "gpio",
			});
		});

		it("sets up gpio pin modes", () => {
			initialize();
			expect(modes).toEqual({
				[Pin.RST]: OUTPUT,
				[Pin.CS]: OUTPUT,
				[Pin.DC]: OUTPUT,
				[Pin.BUSY]: INPUT,
			});
		});

		it("sets up SPI", () => {
			initialize();
			expect(spiBegin).toHaveBeenCalledTimes(1);
			expect(spiSetDataMode).toHaveBeenCalledWith(0);
			expect(spiSetClockDivider).toHaveBeenCalledWith(128);
			expect(spiChipSelect).toHaveBeenCalledWith(0);
			expect(spiSetCSPolarity).toHaveBeenCalledWith(0, LOW);
		});

		it("writes all the commands and data needed for initialization", () => {
			initialize();
			expect(commands).toEqual([
				"CS1",

				"RST1",
				"~200",
				"RST0",
				"~2",
				"RST1",
				"~200",

				"DC0",
				"CS0",
				":12",
				"CS1",
				"?BUSY",
				"~200",

				"DC0",
				"CS0",
				":46",
				"CS1",

				"CS0",
				"DC1",
				":f7",
				"CS1",
				"?BUSY",
				"~200",

				"DC0",
				"CS0",
				":47",
				"CS1",
				"CS0",
				"DC1",
				":f7",
				"CS1",
				"?BUSY",
				"~200",

				"DC0",
				"CS0",
				":c",
				"CS1",
				"CS0",
				"DC1",
				":ae,c7,c3,c0,40",
				"CS1",

				"DC0",
				"CS0",
				":1",
				"CS1",
				"CS0",
				"DC1",
				":af,2,1",
				"CS1",

				"DC0",
				"CS0",
				":11",
				"CS1",
				"CS0",
				"DC1",
				":1",
				"CS1",

				"DC0",
				"CS0",
				":44",
				"CS1",
				"CS0",
				"DC1",
				":0,0,6f,3",
				"CS1",

				"DC0",
				"CS0",
				":45",
				"CS1",
				"CS0",
				"DC1",
				":af,2,0,0",
				"CS1",

				"DC0",
				"CS0",
				":3c",
				"CS1",
				"CS0",
				"DC1",
				":1",
				"CS1",

				"DC0",
				"CS0",
				":18",
				"CS1",
				"CS0",
				"DC1",
				":80",
				"CS1",

				"DC0",
				"CS0",
				":22",
				"CS1",
				"CS0",
				"DC1",
				":b1",
				"CS1",

				"DC0",
				"CS0",
				":20",
				"CS1",
				"?BUSY",
				"~200",

				"DC0",
				"CS0",
				":4e",
				"CS1",
				"CS0",
				"DC1",
				":0,0",
				"CS1",

				"DC0",
				"CS0",
				":4f",
				"CS1",
				"CS0",
				"DC1",
				":af,2",
				"CS1",
			]);
		});
	});
});
