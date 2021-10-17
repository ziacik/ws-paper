import { Drawer } from "./lib/drawer";
import { LowCommunicator } from "./lib/low";

console.log("ws-paper");

const device = new LowCommunicator();
const drawer = new Drawer(device);

device.initialize();
drawer.clear();
device.finalize();
