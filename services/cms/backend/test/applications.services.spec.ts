// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { ApplicationsService } from 'src/modules/applications/applications.service';
// import { Application } from 'src/modules/applications/schemas/application.schema';

// describe('ApplicationsService', () => {
//   let service: ApplicationsService;
//   let model: any;

//   // Sample data to be used in tests
//   const mockApplication = { job_id: 1, name: 'Test Application' };
//   const applicationArray = [
//     { job_id: 1, name: 'Test Application 1' },
//     { job_id: 2, name: 'Test Application 2' },
//   ];

//   // Create a mock constructor function that simulates creating a new document
//   const applicationModelMock = jest.fn((dto) => ({
//     ...dto,
//     save: jest.fn().mockResolvedValue({ ...dto, _id: 'someId' }),
//   }));

//   // Attach static methods to the constructor to simulate Mongoose's Model methods
//   applicationModelMock.find = jest.fn().mockReturnValue({
//     exec: jest.fn().mockResolvedValue(applicationArray),
//   });
//   applicationModelMock.findOne = jest.fn().mockReturnValue({
//     exec: jest.fn().mockResolvedValue(mockApplication),
//   });
//   applicationModelMock.findOneAndUpdate = jest.fn().mockReturnValue({
//     exec: jest.fn().mockResolvedValue({ ...mockApplication, name: 'Updated' }),
//   });
//   applicationModelMock.findOneAndDelete = jest.fn().mockReturnValue({
//     exec: jest.fn().mockResolvedValue(mockApplication),
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ApplicationsService,
//         {
//           provide: getModelToken(Application.name),
//           useValue: applicationModelMock,
//         },
//       ],
//     }).compile();

//     service = module.get<ApplicationsService>(ApplicationsService);
//     model = module.get(getModelToken(Application.name));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a new application', async () => {
//       const dto = { job_id: 1, name: 'New Application' };
//       const createdApplication = await service.create(dto);
//       expect(createdApplication).toEqual({ ...dto, _id: 'someId' });
//       // Ensure the model was called as a constructor with the dto
//       expect(model).toHaveBeenCalledWith(dto);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of applications', async () => {
//       const apps = await service.findAll();
//       expect(apps).toEqual(applicationArray);
//       expect(model.find).toHaveBeenCalled();
//     });
//   });

//   describe('findOne', () => {
//     it('should return one application by job_id', async () => {
//       const app = await service.findOne(1);
//       expect(app).toEqual(mockApplication);
//       expect(model.findOne).toHaveBeenCalledWith({ job_id: 1 });
//     });
//   });

//   describe('update', () => {
//     it('should update and return the updated application', async () => {
//       const updateDto = { name: 'Updated' };
//       const updatedApp = await service.update(1, updateDto);
//       expect(updatedApp).toEqual({ ...mockApplication, name: 'Updated' });
//       expect(model.findOneAndUpdate).toHaveBeenCalledWith(
//         { job_id: 1 },
//         updateDto,
//         { new: true },
//       );
//     });
//   });

//   describe('remove', () => {
//     it('should remove an application and return { deleted: true }', async () => {
//       const result = await service.remove(1);
//       expect(result).toEqual({ deleted: true });
//       expect(model.findOneAndDelete).toHaveBeenCalledWith({ job_id: 1 });
//     });

//     it('should return { deleted: false } if no application is found', async () => {
//       // Simulate not finding the document by returning null
//       model.findOneAndDelete.mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValue(null),
//       });
//       const result = await service.remove(999);
//       expect(result).toEqual({ deleted: false });
//       expect(model.findOneAndDelete).toHaveBeenCalledWith({ job_id: 999 });
//     });
//   });
// });
