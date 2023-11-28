import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class VoteDto {
    @ApiProperty({
        type: String,
        description: "user id",
        required: true,
        example: '705198568067301457',
    })
    @Expose()
    user: string

    @ApiProperty({
        type: String,
        description: "Action type",
        required: true,
        example: 'upvote',
    })
    @Expose()
    type: string;

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
