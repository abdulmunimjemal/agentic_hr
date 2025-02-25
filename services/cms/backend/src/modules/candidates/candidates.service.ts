import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate } from './schemas/candidate.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
  ) {}

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    const newCandidate = new this.candidateModel(dto);
    return newCandidate.save();
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateModel.find().exec();
  }

  async findOne(id: string): Promise<Candidate> {
    return this.candidateModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateCandidateDto): Promise<Candidate> {
    return this.candidateModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.candidateModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }
}
