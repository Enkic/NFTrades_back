import { Test, TestingModule } from '@nestjs/testing';
import { TopWalletController } from './top-wallet.controller';
import { TopWalletService } from './top-wallet.service';

describe('TopWalletController', () => {
  let controller: TopWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopWalletController],
      providers: [TopWalletService],
    }).compile();

    controller = module.get<TopWalletController>(TopWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
