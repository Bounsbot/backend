import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
    @ApiProperty({
        type: String,
        description: "username",
        required: true,
        example: 'badbouns',
    })
    @Expose()
    username: string

    @ApiProperty({
        type: String,
        description: "display name",
        required: true,
        example: 'Bouns'
    })
    @Expose()
    displayName: string

    @ApiProperty({
        type: String,
        description: "user identifiant",
        required: true,
        example: '266636247017979904'
    })
    @Expose()
    id: string;

    @ApiProperty({
        type: String,
        description: "query element",
    })
    @Expose()
    query: string;

    @ApiProperty({
        type: Boolean,
        description: "is weekend",
    })
    @Expose()
    isWeekend: boolean;

    @ApiProperty({
        type: String,
        description: "bot id",
        required: true,
        example: '705198568067301457',
    })
    @Expose()
    bot: string;
}
