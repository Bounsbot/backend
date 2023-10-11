import { Injectable } from '@nestjs/common';
import { AWSError, S3 } from 'aws-sdk';
import { CreateFileDto } from './dto/create-file.dto';
import { GetFileDto } from './dto/get-file.dto';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class S3Service {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async getObject(getFileDto: GetFileDto): Promise<S3.GetObjectOutput> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_BUCKET,
      Key: getFileDto.filename,
    };

    return await this.s3.getObject(params).promise();
  }

  async set(createFileDto: CreateFileDto): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: createFileDto.filename,
      Body: createFileDto.file,
      ACL: 'private',
      ContentType: 'image/png',
    };

    await this.s3.putObject(params).promise();

    return params.Key;
  }

  async delete(filename: string): Promise<S3.DeleteObjectOutput | AWSError> {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
    };

    return await this.s3.deleteObject(params).promise();
  }
}
