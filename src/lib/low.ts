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

export enum Pin {
	RST = 17,
	DC = 25,
	CS = 8,
	BUSY = 24,
}

export function initialize(): void {
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

	reset();
	command(0x12);
	waitUntilIdle();
	command(0x46);
	data(0xf7);
	waitUntilIdle();
	command(0x47);
	data(0xf7);
	waitUntilIdle();
	command(0x0c);
	data(0xae, 0xc7, 0xc3, 0xc0, 0x40);
	command(0x01);
	data(0xaf, 0x02, 0x01);
	command(0x11);
	data(0x01);
	command(0x44);
	data(0x00, 0x00, 0x6f, 0x03);
	command(0x45);
	data(0xaf, 0x02, 0x00, 0x00);
	command(0x3c);
	data(0x01);
	command(0x18);
	data(0x80);
	command(0x22);
	data(0xb1);
	command(0x20);
	waitUntilIdle();
	command(0x4e);
	data(0x00, 0x00);
	command(0x4f);
	data(0xaf, 0x02);
}

export function finalize(): void {
	deviceSleep();

	msleep(2000);

	write(Pin.CS, LOW);
	write(Pin.DC, LOW);
	write(Pin.RST, LOW);

	spiEnd();
	exit();
}

export function draw(_blackBytes: number[], _redBytes: number[]): void {
	// TODO
}

function deviceSleep() {
	command(0x10);
	data(0x01);
}

function reset(): void {
	write(Pin.RST, 1);
	msleep(200);
	write(Pin.RST, 0);
	msleep(2);
	write(Pin.RST, 1);
	msleep(200);
}

function command(id: number) {
	write(Pin.DC, 0);
	write(Pin.CS, 0);
	spiWrite(Buffer.alloc(1, id), 1);
	write(Pin.CS, 1);
}

function data(...data: number[]) {
	write(Pin.CS, 0);
	write(Pin.DC, 1);
	spiWrite(Buffer.from(data), data.length);
	write(Pin.CS, 1);
}

function waitUntilIdle() {
	while (read(Pin.BUSY)) {
		msleep(10);
	}
	msleep(200);
}
