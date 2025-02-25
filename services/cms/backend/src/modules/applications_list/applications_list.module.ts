import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsListService } from './applications_list.service';
import { ApplicationsList, ApplicationsListSchema } from './schema/applications_list.schema';
import { ApplicationsListController } from './applications_list.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ApplicationsList.name, schema: ApplicationsListSchema, collection: 'applications_list'}]),
  ],
  controllers: [ApplicationsListController],
  providers: [ApplicationsListService],
  exports: [ApplicationsListService],
})
export class ApplicationsListModule {}
