# Waveshare Paper

High-level javascript library and CLI for drawing on a Waveshare e-Paper using Raspberry PI GPIO.

Currently, only a single device support is implemented, [EPD 7.5inch HD (B)](<https://www.waveshare.com/wiki/7.5inch_HD_e-Paper_HAT_(B)>).

The source is inspired by [original waveshare example code](https://github.com/waveshare/e-Paper/blob/04d4621789dd6832222e1c7be8f04f93f51df331/RaspberryPi_JetsonNano/c/examples/EPD_7in5b_HD_test.c).

Library documentation is at [https://ziacik.github.io/ws-paper/](https://ziacik.github.io/ws-paper/).

## Prerequisites

Because the library uses _SPI_ to write data to the device, _SPI_ access need to be enabled on Raspberry.

To do that, run

`sudo raspi-config`

Then select _Interface Options_, and enable _SPI_.

## Usage as a library

Install `npm i ws-paper`.

Import a specific implementation of `Device`, and a high-level class for drawing, `Drawer`.

Initialize the device, draw whatever you need to, and don't forget to finalize the device at the end, even in case of error.

Example:

```typescript
import { Drawer, Paper75HDB } from "ws-paper";

const device = new Paper75HDB();
const drawer = new Drawer(device);

const svg = `<svg width="${device.width}" height="${device.height}"><text font-size="50" x="50%" y="20%" text-anchor="middle">Hello, world!</text></svg>`;

device.initialize();
drawer.drawSvg(svg).finally(() => device.finalize());
```

## Usage as a CLI

**Please note**, the cli needs to be used **as root** because `rpio` needs access to `/dev/mem` which is not allowed for non-root users.

Install globally `npm i -g ws-paper`.

Run `ws-paper --help` to get list of available commands.

Example:

`ws-paper draw "<svg viewBox='0 0 880 528'><text font-size='120' x='50%' y='50%' text-anchor='middle'>Hello, world</text></svg>"`

The svg can be piped to the `ws-paper` from file or internet:

`curl https://upload.wikimedia.org/wikipedia/commons/a/ad/24_petal_lotus_circle.svg | ws-paper draw`
