import { Console, ConsoleConstructorOptions } from "node:console";
import { Writable } from "node:stream";
import { mkdirSync, existsSync, statSync, createWriteStream } from "node:fs";
import { resolve, join } from "node:path";

export type LoggerConstructorOptions = {
  logDir?: string;
  addPidToFilename?: boolean;
  enableStdio?: boolean;
  enableTimestamp?: boolean;
};

const lf = Buffer.from([10]);
const crlf = Buffer.from([13, 10]);
const space = Buffer.from([32]);

export class Logger extends Console {
  private options: Required<LoggerConstructorOptions>;

  private outDate?: string;
  private outFile?: Writable;
  private errDate?: string;
  private errFile?: Writable;

  constructor(options?: LoggerConstructorOptions, consoleOptions?: ConsoleConstructorOptions) {
    super({
      ...consoleOptions,
      stdout: new Writable({
        write: (chunk, encoding, callback) => {
          const curDate = this.curDate();
          if (this.outDate !== curDate) {
            this.outFile?.end();
            this.outDate = curDate;
            this.renewOutFile();
          }
          const raw = Buffer.from(chunk, encoding);
          const msg = this.options.enableTimestamp ? Buffer.concat([Buffer.from(this.curTime(), "ascii"), raw.indexOf(lf) !== -1 ? lf : raw.indexOf(crlf) !== -1 ? crlf : space, raw]) : raw;
          if (this.options.enableStdio) {
            process.stdout.write(msg, (err) => {
              if (err) {
                return callback(err);
              }
              this.outFile!.write(msg, callback);
            });
          } else {
            this.outFile!.write(msg, callback);
          }
        },
      }),
      stderr: new Writable({
        write: (chunk, encoding, callback) => {
          const curDate = this.curDate();
          if (this.errDate !== curDate) {
            this.errFile?.end();
            this.errDate = curDate;
            this.renewErrFile();
          }
          const raw = Buffer.from(chunk, encoding);
          const msg = this.options.enableTimestamp ? Buffer.concat([Buffer.from(this.curTime(), "ascii"), raw.indexOf(lf) !== -1 ? lf : raw.indexOf(crlf) !== -1 ? crlf : space, raw]) : raw;
          if (this.options.enableStdio) {
            process.stderr.write(msg, (err) => {
              if (err) {
                return callback(err);
              }
              this.errFile!.write(msg, callback);
            });
          } else {
            this.errFile!.write(msg, callback);
          }
        },
      }),
    });

    this.options = {
      logDir: resolve(options?.logDir ?? "log"),
      addPidToFilename: options?.addPidToFilename ?? false,
      enableStdio: options?.enableStdio ?? false,
      enableTimestamp: options?.enableTimestamp ?? true,
    };
    if (!existsSync(this.options.logDir) || !statSync(this.options.logDir).isDirectory()) {
      mkdirSync(this.options.logDir, { recursive: true });
    }
  }
  private renewOutFile() {
    this.outFile = createWriteStream(join(this.options.logDir, `${this.outDate}${this.options.addPidToFilename ? "." + process.pid : ""}.out.log`), { flags: "a" });
  }
  private renewErrFile() {
    this.errFile = createWriteStream(join(this.options.logDir, `${this.errDate}${this.options.addPidToFilename ? "." + process.pid : ""}.err.log`), { flags: "a" });
  }
  private curDate() {
    const time = new Date();

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();

    return `${year}-${`${month}`.padStart(2, "0")}-${`${date}`.padStart(2, "0")}`;
  }
  private curTime() {
    const time = new Date();

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const milliSecond = time.getMilliseconds();

    return `${year}-${`${month}`.padStart(2, "0")}-${`${date}`.padStart(2, "0")} ${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}:${`${second}`.padStart(2, "0")},${`${milliSecond}`.padStart(3, "0")}`;
  }
}
