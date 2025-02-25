import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationsList } from './schema/applications_list.schema';
import { CreateApplicationsListDto } from './dto/create-applications_list.dto';
import { UpdateApplicationsListDto } from './dto/update-applications_list.dto';

@Injectable()
export class ApplicationsListService {
  constructor(
    @InjectModel(ApplicationsList.name)
    private applicationsListModel: Model<ApplicationsList>,
  ) {}

  async create(dto: CreateApplicationsListDto): Promise<ApplicationsList> {
    const newDoc = new this.applicationsListModel(dto);
    return newDoc.save();
  }

  async findAll(): Promise<ApplicationsList[]> {
    return this.applicationsListModel.find().exec();
  }

  async findOne(jobId: number): Promise<ApplicationsList> {
    return this.applicationsListModel.findOne({ job_id: jobId }).exec();
  }

  async update(
    jobId: number,
    updateDto: UpdateApplicationsListDto,
  ): Promise<ApplicationsList> {
    return this.applicationsListModel
      .findOneAndUpdate({ job_id: jobId }, updateDto, { new: true })
      .exec();
  }

  async remove(jobId: number): Promise<{ deleted: boolean }> {
    const result = await this.applicationsListModel
      .findOneAndDelete({ job_id: jobId })
      .exec();
    return { deleted: !!result };
  }
}
