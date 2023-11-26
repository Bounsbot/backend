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

export class GuildConfigurationException extends HttpException {
    constructor() {
        super(
            {
                message: 'Une erreur est survenue lors de la récupération de la configuration.',
                status: HttpStatus.FORBIDDEN,
                id: 'error.guilds.configuration',
            },
            HttpStatus.FORBIDDEN,
        );
    }
}

export class GuildConfigurationDoesntException extends HttpException {
    constructor() {
        super(
            {
                message: 'Aucune configuration n\'a été trouvé.',
                status: HttpStatus.NOT_FOUND,
                id: 'error.guilds.configuration.not_found',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
