/* eslint-disable no-console */
const white = "\x1b[37m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";

const Log = (msg: string): void => console.log(green, msg, white);
const Warn = (msg: string): void => console.log(yellow, msg, white);
const Danger = (msg: string): void => console.log(red, msg, white);

export { Log, Warn, Danger };
