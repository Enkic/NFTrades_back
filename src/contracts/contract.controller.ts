import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Duration, GroupPeriod } from 'src/core/common/common.types';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('Contracts')
export class ContractController {
  constructor(private readonly ContractService: ContractService) {}
}
