import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AlchemyService],
  exports: [AlchemyService],
})
export class AlchemyModule {}
