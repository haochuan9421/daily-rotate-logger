# daily-rotate-logger

> A simple Node.js logger base on [Console](https://nodejs.org/api/console.html#class-console), log to file and rotate daily.

### Installation

```bash
npm i daily-rotate-logger
```

### Quick Start

```js
import { Logger } from "daily-rotate-logger";

// logDir is the root directory for storing log files
global.console = new Logger({ logDir: "log" });

// Logger is a subclass of Console, you can use any method in console as usual
console.log("hello world"); // This log will append to "yyyy-mm-dd.out.log" file in log directory
console.error(new Error("oops!")); // This log will append to "yyyy-mm-dd.err.log" file in log directory
```
