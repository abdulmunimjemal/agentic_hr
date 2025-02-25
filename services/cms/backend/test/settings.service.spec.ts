import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SettingsService } from 'src/modules/settings/settings.service';
import { Setting } from 'src/modules/settings/schemas/setting.schema';
import { Model } from 'mongoose';

describe('SettingsService', () => {
    let service: SettingsService;
    let model: Model<Setting>;
  
    // Sample data used for tests
    const mockSetting = { key: 'testKey', value: 'testValue' };
    const settingsArray = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];
  
    // Create a mock for the Mongoose model.
    // Casting to 'any' and then to Model<Setting> to allow static method assignment.
    const settingModelMock = jest.fn((dto: any) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'someId' }),
    })) as any as Model<Setting>;
  
    // Mock static methods that the service might call.
    settingModelMock.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(settingsArray),
    });
    settingModelMock.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSetting),
    });
    settingModelMock.findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ ...mockSetting, value: 'updatedValue' }),
    });
    settingModelMock.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSetting),
    });
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SettingsService,
          {
            provide: getModelToken(Setting.name),
            useValue: settingModelMock,
          },
        ],
      }).compile();
  
      service = module.get<SettingsService>(SettingsService);
      model = module.get<Model<Setting>>(getModelToken(Setting.name));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('create', () => {
      it('should create a new setting', async () => {
        const dto = { key: 'newKey', value: 'newValue' };
        const created = await service.create(dto);
        expect(created).toEqual({ ...dto, _id: 'someId' });
        expect(settingModelMock).toHaveBeenCalledWith(dto);
      });
    });
  
    describe('findAll', () => {
      it('should return an array of settings', async () => {
        const settings = await service.findAll();
        expect(settings).toEqual(settingsArray);
        expect(settingModelMock.find).toHaveBeenCalled();
      });
    });
  
    describe('findOne', () => {
      it('should return a single setting by key', async () => {
        // Assuming findOne is implemented to search by a unique key.
        const setting = await service.findOne('testKey');
        expect(setting).toEqual(mockSetting);
        expect(settingModelMock.findOne).toHaveBeenCalledWith({ key: 'testKey' });
      });
    });
  
    describe('update', () => {
      it('should update a setting and return the updated document', async () => {
        const updateDto = { value: 'updatedValue' };
        const updated = await service.update('testKey', updateDto);
        expect(updated).toEqual({ ...mockSetting, value: 'updatedValue' });
        expect(settingModelMock.findOneAndUpdate).toHaveBeenCalledWith(
          { key: 'testKey' },
          updateDto,
          { new: true }
        );
      });
    });
  
    describe('remove', () => {
      it('should remove a setting and return { deleted: true }', async () => {
        const result = await service.remove('testKey');
        expect(result).toEqual({ deleted: true });
        expect(settingModelMock.findOneAndDelete).toHaveBeenCalledWith({ key: 'testKey' });
      });
  
      it('should return { deleted: false } if no setting is found', async () => {
        // Explicitly cast the method to a Jest mock so we can use mockReturnValueOnce
        ((settingModelMock.findOneAndDelete) as jest.Mock).mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(null),
        });
        const result = await service.remove('nonexistent');
        expect(result).toEqual({ deleted: false });
        expect(settingModelMock.findOneAndDelete).toHaveBeenCalledWith({ key: 'nonexistent' });
      });
    });
  });
