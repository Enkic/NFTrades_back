import { Module } from '@nestjs/common';
import { MnemonichqService } from './mnemonichq.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MnemonichqService],
  exports: [MnemonichqService],
})
export class MnemonichqModule {}
