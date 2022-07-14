import { PartialType } from '@nestjs/mapped-types';
import { CreateTopWalletDto } from './create-top-wallet.dto';

export class UpdateTopWalletDto extends PartialType(CreateTopWalletDto) {}
