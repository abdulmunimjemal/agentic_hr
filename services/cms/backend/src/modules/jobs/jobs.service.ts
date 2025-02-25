// src/modules/jobs/jobs.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const newJob = new this.jobModel(createJobDto);
    return newJob.save();
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  async findOne(job_id: number): Promise<Job> {
    return this.jobModel.findById(job_id).exec();
  }

  async update(job_id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    return this.jobModel.findByIdAndUpdate(job_id, updateJobDto, { new: true }).exec();
  }

  async remove(job_id: number): Promise<{ deleted: boolean }> {
    const result = await this.jobModel.findByIdAndDelete(job_id).exec();
    return { deleted: !!result };
  }
}
