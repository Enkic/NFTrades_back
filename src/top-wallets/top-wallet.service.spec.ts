import { Test, TestingModule } from '@nestjs/testing';
import { TopWalletService } from './top-wallet.service';

describe('TopWalletService', () => {
  let service: TopWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopWalletService],
    }).compile();

    service = module.get<TopWalletService>(TopWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
