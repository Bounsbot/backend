import { HttpException, HttpStatus } from '@nestjs/common';

export class PixelwarAlreadyExistException extends HttpException {
  constructor() {
    super(
      {
        message: 'Pixelwar already exist',
        status: HttpStatus.CONFLICT,
        id: 'error.pixelwar.already_exist',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class PixelwarCreatedExecption extends HttpException {
  constructor() {
    super(
      {
        message: 'Error while creating the pixelwar',
        status: HttpStatus.UNAUTHORIZED,
        id: 'error.create.pixelwar',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
