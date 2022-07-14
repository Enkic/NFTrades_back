import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create-contract.dto';
import { Contract, ContractDocument } from './schema/contract.schema';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,
  ) {}
  create(createContractDto: CreateContractDto): Promise<ContractDocument> {
    return this.contractModel.create(createContractDto);
  }

  update(id: string, contract: any): Promise<ContractDocument> {
    return this.contractModel.findByIdAndUpdate(id, contract).exec();
  }

  findAll(): Promise<ContractDocument[]> {
    return this.contractModel.find({}).exec();
  }

  findById(id: string): Promise<ContractDocument | null> {
    return this.contractModel.findById(id).exec();
  }
}
