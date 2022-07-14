import { Test, TestingModule } from '@nestjs/testing';
import { MnemonichqService } from './mnemonichq.service';

describe('S3Service', () => {
  let service: MnemonichqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MnemonichqService],
    }).compile();

    service = module.get<MnemonichqService>(MnemonichqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
