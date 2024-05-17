import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UsersIdListDto {
    @ApiProperty({
        type: Array<String>,
        description: "List of user id",
        required: true,
        example: "['266636247017979904']"
    })
    @Expose()
    ids: Array<String>

    @ApiProperty({
        type: String,
        description: "Guild id",
        required: true,
        example: "705198568067301457"
    })
    @Expose()
    guildId: String
}
