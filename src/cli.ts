import { load } from "pipe-args";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Device } from "./lib/device";
import { Drawer } from "./lib/drawer";
import { Paper75HDB } from "./lib/paper75HDB";

const isRunningInJest = process.env.JEST_WORKER_ID !== undefined;

function getDevice(): Device {
	return new Paper75HDB();
}

async function clear(): Promise<void> {
	const device = getDevice();
	const drawer = new Drawer(device);
	device.initialize();
	try {
		await drawer.clear();
	} finally {
		device.finalize();
	}
}

async function draw(what: string): Promise<void> {
	const device = getDevice();
	const drawer = new Drawer(device);
	device.initialize();
	try {
		await drawer.drawSvg(what);
	} finally {
		device.finalize();
	}
}

export async function cli(...args: string[]): Promise<void> {
	try {
		await yargs(args)
			.scriptName("ws-paper")
			.command("clear", "Clears the device", clear)
			.command(
				"draw <what>",
				"Draws an image on the device",
				(yargs) => {
					return yargs.positional("what", {
						description: "What to draw. Right now, only a svg is supported. This has to be actual definition of svg, not a file path or url.",
					});
				},
				async (argv) => {
					await draw("" + argv.what);
				}
			)
			.demandCommand()
			.exitProcess(!isRunningInJest)
			.parse();
	} catch (e) {
		console.error(e);
	}
}

if (!isRunningInJest) {
	load();
	cli(...hideBin(process.argv));
}
