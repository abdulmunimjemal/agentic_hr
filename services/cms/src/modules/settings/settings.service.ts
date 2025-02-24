import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}

  async create(dto: CreateSettingDto): Promise<Setting> {
    const newSetting = new this.settingModel(dto);
    return newSetting.save();
  }

  async findAll(): Promise<Setting[]> {
    return this.settingModel.find().exec();
  }

  async findOne(id: string): Promise<Setting> {
    return this.settingModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateSettingDto): Promise<Setting> {
    return this.settingModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.settingModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }
}
