import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGODB_DATABASE_CONNECTION } from '../../../common/constants/app.constant';
import { Testing, TestingDocument } from '../schemas/testing.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Testing.name, MONGODB_DATABASE_CONNECTION)
    private readonly testingModel: Model<TestingDocument>,
  ) {}

  create(
    input: Pick<Testing, 'name' | 'description' | 'isActive' | 'isDeleted'>,
  ): Promise<TestingDocument> {
    return this.testingModel.create(input);
  }

  findAll(): Promise<TestingDocument[]> {
    return this.testingModel.find().sort({ createdAt: -1 }).exec();
  }

  findByName(name: string): Promise<TestingDocument | null> {
    return this.testingModel.findOne({ name }).exec();
  }
}
