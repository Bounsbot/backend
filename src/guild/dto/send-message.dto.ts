import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class SendMessageDto {
  @ApiProperty({
    type: String,
    description: 'Guild where channel is',
    required: true,
    example: '705198568067301457',
  })
  @IsNotEmpty()
  @Expose()
  guildId: String;

  @ApiProperty({
    type: String,
    description: 'guildChannel where you want to send this message',
    required: true,
    example: '996424096348897321',
  })
  @Expose()
  @IsNotEmpty()
  channelId: String;

  @ApiProperty({
    type: String,
    description: 'Content of the message',
    required: true,
    example: 'Hello world',
  })
  @Expose()
  @IsNotEmpty()
  content: String;

  @ApiProperty({
    type: Array<any>,
    description: 'embeds array',
    required: true,
  })
  @Expose()
  @IsOptional()
  embeds: Array<any>;

  @ApiProperty({
    type: Array<any>,
    description: 'Id of message you want to reply',
    required: true,
    example: "1019363745438384129"
  })
  @Expose()
  @IsOptional()
  replyTo: String;
}
