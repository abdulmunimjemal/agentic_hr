import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterviewResult } from './schemas/interview-result.schema';
import { CreateInterviewResultDto } from './dto/create-interview-result.dto';
import { UpdateInterviewResultDto } from './dto/update-interview-result.dto';

@Injectable()
export class InterviewResultsService {
  constructor(
    @InjectModel(InterviewResult.name)
    private interviewResultModel: Model<InterviewResult>,
  ) {}

  async create(dto: CreateInterviewResultDto): Promise<InterviewResult> {
    const created = new this.interviewResultModel(dto);
    return created.save();
  }

  async findAll(): Promise<InterviewResult[]> {
    return this.interviewResultModel.find().exec();
  }

  async findOne(id: string): Promise<InterviewResult> {
    return this.interviewResultModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateInterviewResultDto): Promise<InterviewResult> {
    return this.interviewResultModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<InterviewResult> {
    return this.interviewResultModel.findByIdAndDelete(id).exec();
  }
  
}
