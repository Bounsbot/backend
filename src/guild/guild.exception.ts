import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigurationNotExistException extends HttpException {
    constructor() {
        super(
            {
                message: 'Le body doit contenir la configuration.',
                status: HttpStatus.BAD_REQUEST,
                id: 'error.guilds.configuration_not_exist',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}


export class CantSendMessageException extends HttpException {
    constructor() {
        super(
            {
                message: 'Impossible d\'envoyer le message.',
                status: HttpStatus.REQUEST_TIMEOUT,
                id: 'error.guilds.cant_send_message',
            },
            HttpStatus.REQUEST_TIMEOUT,
        );
    }
}
