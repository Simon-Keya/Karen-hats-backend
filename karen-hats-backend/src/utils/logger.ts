import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  log(message: string) {
    // add custom behavior here
    super.log(message);
  }

  error(message: string, trace: string) {
    // add custom behavior here
    super.error(message, trace);
  }

  warn(message: string) {
    // add custom behavior here
    super.warn(message);
  }
}
