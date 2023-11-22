import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthUnauthorizedException extends HttpException {
    constructor() {
        super(
            {
                message: 'Unauthorized',
                status: HttpStatus.UNAUTHORIZED,
                id: 'error.auth.unauthorized',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class AuthGuildPermissionException extends HttpException {
    constructor() {
        super(
            {
                message: 'Insufficient permission to access this guild.',
                status: HttpStatus.UNAUTHORIZED,
                id: 'error.auth.guild_permission',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class GuildIdMissingException extends HttpException {
    constructor() {
        super(
            {
                message: 'Guild id missing.',
                status: HttpStatus.BAD_REQUEST,
                id: 'error.auth.guild_id_missing',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class invalidTokenException extends HttpException {
    constructor() {
        super(
            {
                message: 'Invalid token.',
                status: HttpStatus.UNAUTHORIZED,
                id: 'error.auth.invalid_token',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}