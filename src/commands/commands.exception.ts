import { HttpException, HttpStatus } from '@nestjs/common';

export class RetrieveCommandsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Error while retrieving commands',
        status: HttpStatus.GATEWAY_TIMEOUT,
        id: 'error.commands.retrieve',
      },
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}

