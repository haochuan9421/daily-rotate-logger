import { Console, ConsoleConstructorOptions } from "node:console";
import { Writable } from "node:stream";
import { mkdirSync, existsSync, statSync, createWriteStream } from "node:fs";
import { resolve, join } from "node:path";

export type LoggerConstructorOptions = { logDir?: string };

export class Logger extends Console {
  private options: Required<LoggerConstructorOptions>;

  private outDate?: string;
  private outFile?: Writable;
  private errDate?: string;
  private errFile?: Writable;

  constructor(options: LoggerConstructorOptions, consoleOptions: ConsoleConstructorOptions) {
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
          this.outFile!.write(Buffer.concat([Buffer.from(this.curTime(), "ascii"), Buffer.from([0x20]), Buffer.from(chunk, encoding)]), callback);
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
          this.errFile!.write(Buffer.concat([Buffer.from(this.curTime(), "ascii"), Buffer.from([0x20]), Buffer.from(chunk, encoding)]), callback);
        },
      }),
    });

    this.options = {
      logDir: resolve(options.logDir ?? "log"),
    };
    if (!existsSync(this.options.logDir) || !statSync(this.options.logDir).isDirectory()) {
      mkdirSync(this.options.logDir, { recursive: true });
    }
  }
  private renewOutFile() {
    this.outFile = createWriteStream(join(this.options.logDir, `${this.outDate}.out.log`), { flags: "a" });
  }
  private renewErrFile() {
    this.errFile = createWriteStream(join(this.options.logDir, `${this.errDate}.err.log`), { flags: "a" });
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
