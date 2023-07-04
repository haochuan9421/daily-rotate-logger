# daily-rotate-logger

[English](#installation) [中文文档](#安装)

---

> A simple Node.js logger base on [Console](https://nodejs.org/api/console.html#class-console), log to file and rotate daily.

### Installation

```bash
npm i daily-rotate-logger
```

### Quick Start

```js
import { Logger } from "daily-rotate-logger";

// Logger is a subclass of Console, you can use any method in console as usual
global.console = new Logger({
  logDir: "log", // logDir is the root directory for storing log files
  addPidToFilename: false, // If "false", the log file name will be like "yyyy-mm-dd.out.log", if "true", "yyyy-mm-dd.pid.out.log", default "false".
  enableStdio: process.env.NODE_ENV === "development", // Set if also log to "process.stdout" or "process.stderr", default "false"
  enableTimestamp: true, // Set if auto add timestamp to every log, format like "2023-07-04 22:39:50,183"
});

console.log("hello world"); // This log will append to "yyyy-mm-dd.out.log" file
console.error(new Error("oops!")); // This log will append to "yyyy-mm-dd.err.log" file
```

You can also create multiple loggers for different purpose.

```js
import { Logger } from "daily-rotate-logger";

const sqlLogger = new Logger({ logDir: "log/sql" });
const routerLogger = new Logger({ logDir: "log/router" });
// ...
```

---

> 一个简单的，基于 [Console](https://nodejs.org/api/console.html#class-console) 的 Node.js logger, 可将日志输入到文件并按天滚动.

### 安装

```bash
npm i daily-rotate-logger
```

### 快速上手

```js
import { Logger } from "daily-rotate-logger";

// Logger 是 Console 的子类, 你可以像平常那样使用任何 console 上的方法
global.console = new Logger({
  logDir: "log", // logDir 是日志文件保存的根目录
  addPidToFilename: false, // 如果是 "false", 日志文件名类似于 "yyyy-mm-dd.out.log", 如果是 "true", "yyyy-mm-dd.pid.out.log", 默认 "false".
  enableStdio: process.env.NODE_ENV === "development", // 设置是否也输出到 "process.stdout" 或 "process.stderr", 默认 "false"
  enableTimestamp: true, // 设置是否给每个日志添加时间戳，格式形如 "2023-07-04 22:39:50,183"
});

console.log("hello world"); // 这个日志会被添加到 "yyyy-mm-dd.out.log" 文件
console.error(new Error("oops!")); // 这个日志会被添加到 "yyyy-mm-dd.err.log" 文件
```

你也可以创建多个用于不同使用目的的 Logger 实例。

```js
import { Logger } from "daily-rotate-logger";

const sqlLogger = new Logger({ logDir: "log/sql" });
const routerLogger = new Logger({ logDir: "log/router" });
// ...
```
