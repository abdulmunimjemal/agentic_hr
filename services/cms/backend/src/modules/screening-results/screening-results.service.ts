import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScreeningResult } from './schemas/screening-result.schema';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';

@Injectable()
export class ScreeningResultsService {
  constructor(
    @InjectModel(ScreeningResult.name)
    private screeningResultModel: Model<ScreeningResult>,
  ) {}

  async create(dto: CreateScreeningResultDto): Promise<ScreeningResult> {
    const created = new this.screeningResultModel(dto);
    return created.save();
  }

  async findAll(): Promise<ScreeningResult[]> {
    return this.screeningResultModel.find().exec();
  }

  async findOne(id: string): Promise<ScreeningResult> {
    return this.screeningResultModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateScreeningResultDto): Promise<ScreeningResult> {
    return this.screeningResultModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ScreeningResult> {
    return this.screeningResultModel.findByIdAndDelete(id).exec();
  }
}
