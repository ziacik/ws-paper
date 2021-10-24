import {
	exit,
	init,
	INPUT,
	LOW,
	mode,
	msleep,
	OUTPUT,
	read,
	spiBegin,
	spiChipSelect,
	spiEnd,
	spiSetClockDivider,
	spiSetCSPolarity,
	spiSetDataMode,
	spiWrite,
	write,
} from "rpio";
import { Device, Pixel8, PixelSize } from "./device";
import { Pin } from "./pin";

export class Paper75HDB implements Device {
	readonly width: PixelSize = 880;
	readonly height: PixelSize = 528;

	initialize(): void {
		init({
			gpiomem: false,
			mapping: "gpio",
		});

		mode(Pin.RST, OUTPUT);
		mode(Pin.DC, OUTPUT);
		mode(Pin.CS, OUTPUT);
		mode(Pin.BUSY, INPUT);

		write(Pin.CS, 1);

		spiBegin();
		spiSetDataMode(0);
		spiSetClockDivider(128);
		spiChipSelect(0);
		spiSetCSPolarity(0, LOW);

		this.reset();
		this.command(0x12);
		this.waitUntilIdle();
		this.command(0x46);
		this.data(0xf7);
		this.waitUntilIdle();
		this.command(0x47);
		this.data(0xf7);
		this.waitUntilIdle();
		this.command(0x0c);
		this.data(0xae, 0xc7, 0xc3, 0xc0, 0x40);
		this.command(0x01);
		this.data(0xaf, 0x02, 0x01);
		this.command(0x11);
		this.data(0x01);
		this.command(0x44);
		this.data(0x00, 0x00, 0x6f, 0x03);
		this.command(0x45);
		this.data(0xaf, 0x02, 0x00, 0x00);
		this.command(0x3c);
		this.data(0x01);
		this.command(0x18);
		this.data(0x80);
		this.command(0x22);
		this.data(0xb1);
		this.command(0x20);
		this.waitUntilIdle();
		this.command(0x4e);
		this.data(0x00, 0x00);
		this.command(0x4f);
		this.data(0xaf, 0x02);
	}

	finalize(): void {
		this.deviceSleep();

		msleep(2000);

		write(Pin.CS, LOW);
		write(Pin.DC, LOW);
		write(Pin.RST, LOW);

		spiEnd();
		exit();
	}

	draw(blackPixels: Pixel8[], redPixels: Pixel8[]): void {
		this.command(0x4f);
		this.data(0xaf, 0x02);

		this.command(0x24);
		this.data(...blackPixels);

		this.command(0x26);
		this.data(...redPixels);

		this.displayOn();
	}

	private displayOn(): void {
		this.command(0x22);
		this.data(0xc7); // Load LUT from MCU(0x32)
		this.command(0x20);
		msleep(200); // !!!The rpio.msleep here is necessary, 200uS at least!!!
		this.waitUntilIdle();
	}

	private deviceSleep() {
		this.command(0x10);
		this.data(0x01);
	}

	private reset(): void {
		write(Pin.RST, 1);
		msleep(200);
		write(Pin.RST, 0);
		msleep(2);
		write(Pin.RST, 1);
		msleep(200);
	}

	private command(id: number) {
		write(Pin.DC, 0);
		write(Pin.CS, 0);
		spiWrite(Buffer.alloc(1, id), 1);
		write(Pin.CS, 1);
	}

	private data(...data: number[]) {
		write(Pin.CS, 0);
		write(Pin.DC, 1);
		spiWrite(Buffer.from(data), data.length);
		write(Pin.CS, 1);
	}

	private waitUntilIdle() {
		while (read(Pin.BUSY)) {
			msleep(10);
		}
		msleep(200);
	}
}
