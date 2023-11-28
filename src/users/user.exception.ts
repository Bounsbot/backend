import { HttpException, HttpStatus } from '@nestjs/common';

export class VoteObjectException extends HttpException {
  constructor() {
    super(
      {
        message: 'Vote object is not valid.',
        status: HttpStatus.BAD_REQUEST,
        id: 'error.user.vote_object',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

