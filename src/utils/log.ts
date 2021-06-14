/* eslint-disable no-console */
const white = "\x1b[37m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";

const log = (msg: string): void => console.log(green, msg, white);
const warn = (msg: string): void => console.log(yellow, msg, white);
const error = (msg: string): void => console.log(red, msg, white);

export { log, warn, error };
