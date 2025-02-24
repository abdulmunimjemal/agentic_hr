import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
  ) {}

  async create(dto: CreateApplicationDto): Promise<Application> {
    // dto should include job_id
    const newApp = new this.applicationModel(dto);
    return newApp.save();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationModel.find().exec();
  }

  // Find by job_id instead of _id
  async findOne(jobId: number): Promise<Application> {
    return this.applicationModel.findOne({ job_id: jobId }).exec();
  }

  // Update by job_id
  async update(jobId: number, updateDto: UpdateApplicationDto): Promise<Application> {
    return this.applicationModel.findOneAndUpdate({ job_id: jobId }, updateDto, {
      new: true,
    }).exec();
  }

  // Remove by job_id
  async remove(jobId: number): Promise<{ deleted: boolean }> {
    const result = await this.applicationModel.findOneAndDelete({ job_id: jobId }).exec();
    return { deleted: !!result };
  }
}
