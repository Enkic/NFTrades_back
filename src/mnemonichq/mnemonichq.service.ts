import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Duration, GroupPeriod } from 'src/core/common/common.types';
import * as moment from 'moment';

@Injectable()
export class MnemonichqService {
  apiKey: string;
  apiUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('MNEMONICHQ_API_KEY');
    this.apiUrl = this.configService.get<string>('MNEMONICHQ_URL');
  }

  public async getTopCollectionsBySalesVolume(
    duration: Duration,
    limit: number,
  ) {
    const url = `${this.apiUrl}/collections/v1beta1/top/by_sales_volume?limit=${limit}&offset=0&duration=${duration}`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      return resp.data['collections'];
    } catch (e) {
      console.error(
        'error: getTopCollectionsBySalesVolume :',
        e.response.data.message,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getContractPriceDataPoints(
    contract: string,
    duration: Duration,
    groupPeriod: GroupPeriod,
  ) {
    const url = `${this.apiUrl}/pricing/v1beta1/prices/by_contract/${contract}?duration=${duration}&groupByPeriod=${groupPeriod}`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      return resp.data['dataPoints'];
    } catch (e) {
      console.error(
        'error: getContractSalesVolumeDataPoints :',
        e.response.data.message,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getTopCollectionsBySalesCount(
    duration: Duration,
    limit: number,
  ) {
    const url = `${this.apiUrl}/collections/v1beta1/top/by_sales_count?limit=${limit}&offset=0&duration=${duration}`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      return resp.data['collections'];
    } catch (e) {
      console.error(
        'error: getTopCollectionsBySalesVolume :',
        e.response.data.message,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getTopCollectionsByAvgPrice(duration: Duration, limit: number) {
    const url = `${this.apiUrl}/collections/v1beta1/top/by_avg_price?limit=${limit}&offset=0&duration=${duration}`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      return resp.data['collections'];
    } catch (e) {
      console.error(
        'error: getTopCollectionsBySalesVolume :',
        e.response.data.message,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getWalletTransactionsThreeMonths(
    wallet: string,
    isSellTransactions: boolean,
    limit: number,
  ) {
    let directionQuery = `fromAddress=${wallet}`;
    if (!isSellTransactions) {
      directionQuery = `toAddress=${wallet}`;
    }
    const timestamp = moment().subtract(3, 'months').format();
    const url = `${
      this.apiUrl
    }/events/v1beta1/transfers/by_address?limit=${limit}&blockTimestampGt=${encodeURIComponent(
      timestamp,
    )}&sortDirection=SORT_DIRECTION_DESC&${directionQuery}&tokenTypes=TOKEN_TYPE_UNKNOWN&tokenTypes=TOKEN_TYPE_ERC721&tokenTypes=TOKEN_TYPE_ERC1155&tokenTypes=TOKEN_TYPE_ERC721_LEGACY`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      return resp.data['transfers'];
    } catch (e) {
      console.error('error: getWalletTransactionsSixMonths :', e);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getWalletBuyTransactions(wallet: string, limit: number) {
    const maxLimit = 50;
    if (limit < 1 || limit > maxLimit) {
      throw new HttpException(
        `Limit must be between 1 and ${maxLimit}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.getWalletTransactionsThreeMonths(wallet, false, limit);
  }

  public async getWalletSellTransactions(wallet: string, limit: number) {
    const maxLimit = 50;
    if (limit < 1 || limit > maxLimit) {
      throw new HttpException(
        `Limit must be between 1 and ${maxLimit}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.getWalletTransactionsThreeMonths(wallet, true, limit);
  }

  public async getWalletRentability(wallet: string) {
    const transactionsSell = await this.getWalletTransactionsThreeMonths(
      wallet,
      true,
      10,
    );
    const transactionsBuy = await this.getWalletTransactionsThreeMonths(
      wallet,
      false,
      10,
    );
    const profitabilityObj = {
      profitabilityThreeMonth: 0,
      profitabilityOneMonth: 0,
      profitabilityOneWeek: 0,

      totalLossThreeMonth: 0,
      totalLossOneMonth: 0,
      totalLossOneWeek: 0,

      totalGainThreeMonth: 0,
      totalGainOneMonth: 0,
      totalGainOneWeek: 0,
    };
    const now = moment();
    for (const transactionSell of transactionsSell) {
      let txSellEthValue = Number(transactionSell?.txValue?.decimalValue);
      txSellEthValue = txSellEthValue ? txSellEthValue : 0;
      if (moment(transactionSell.blockTimestamp).add(3, 'months') > now) {
        profitabilityObj.profitabilityThreeMonth += txSellEthValue;
        profitabilityObj.totalGainThreeMonth += txSellEthValue;
      }
      if (moment(transactionSell.blockTimestamp).add(1, 'months') > now) {
        profitabilityObj.profitabilityOneMonth += txSellEthValue;
        profitabilityObj.totalGainOneMonth += txSellEthValue;
      }
      if (moment(transactionSell.blockTimestamp).add(1, 'week') > now) {
        profitabilityObj.profitabilityOneWeek += txSellEthValue;
        profitabilityObj.totalGainOneWeek += txSellEthValue;
      }
    }
    for (const transactionBuy of transactionsBuy) {
      // console.log(transactionBuy);
      let txBuyEthValue = Number(transactionBuy?.txValue?.decimalValue);
      txBuyEthValue = txBuyEthValue ? txBuyEthValue : 0;
      if (moment(transactionBuy.blockTimestamp).add(3, 'months') > now) {
        profitabilityObj.profitabilityThreeMonth -= txBuyEthValue;
        profitabilityObj.totalLossThreeMonth += txBuyEthValue;
      }
      if (moment(transactionBuy.blockTimestamp).add(1, 'months') > now) {
        profitabilityObj.profitabilityOneMonth -= txBuyEthValue;
        profitabilityObj.totalLossOneMonth += txBuyEthValue;
      }
      if (moment(transactionBuy.blockTimestamp).add(1, 'week') > now) {
        profitabilityObj.profitabilityOneWeek -= txBuyEthValue;
        profitabilityObj.totalLossOneWeek += txBuyEthValue;
      }
    }
    return profitabilityObj;
  }
}
