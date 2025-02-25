import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interview } from './schemas/interview.schema';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name)
    private interviewModel: Model<Interview>,
  ) {}

  async create(dto: CreateInterviewDto): Promise<Interview> {
    const created = new this.interviewModel(dto);
    return created.save();
  }

  async findAll(): Promise<Interview[]> {
    return this.interviewModel.find().exec();
  }

  async findOne(id: string): Promise<Interview> {
    return this.interviewModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateInterviewDto): Promise<Interview> {
    return this.interviewModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Interview> {
    return this.interviewModel.findByIdAndDelete(id).exec();
  }
}
