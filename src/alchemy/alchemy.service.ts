import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Duration } from 'src/core/common/common.types';

@Injectable()
export class AlchemyService {
  apiKey: string;
  apiToken: string;
  apiUrl: string;
  apiDashboardUrl: string;
  webhookUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.apiToken = this.configService.get<string>('ALCHEMY_API_TOKEN');
    this.apiUrl = this.configService.get<string>('ALCHEMY_URL');
    this.apiDashboardUrl = this.configService.get<string>(
      'ALCHEMY_DASHBOARD_URL',
    );
    this.webhookUrl = this.configService.get<string>('ALCHEMY_WEBHOOK_URL');
  }

  public async getOwnersOfContract(
    contractAddresse: string,
    maxArrayLength: number,
  ) {
    const url = `${this.apiUrl}/${this.apiKey}/getOwnersForCollection?contractAddress=${contractAddresse}`;
    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }),
      );
      let owners = resp?.data.ownerAddresses ? resp?.data.ownerAddresses : [];
      if (owners.length > maxArrayLength) {
        owners = owners.slice(0, maxArrayLength);
      }
      return owners;
    } catch (e) {
      console.error('error: getOwnersOfContract :', e);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getTransaction(hash: string) {
    const data = {
      jsonrpc: '2.0',
      id: 0,
      method: 'eth_getTransactionByHash',
      params: [hash],
    };
    try {
      const url = `${this.apiUrl}/${this.apiKey}/`;
      const resp = await firstValueFrom(this.httpService.post(url, data));
      return resp;
    } catch {
      return;
    }
  }

  public async createNewTransferWebhook(
    wallet: string,
    transferType: string,
    userId: string,
  ) {
    const url = `${this.apiDashboardUrl}/create-webhook`;
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          url,
          {
            network: 'ETH_MAINNET',
            webhook_type: transferType,
            webhook_url: `${this.webhookUrl}/${userId}`,
            app_id: this.apiKey,
            addresses: [wallet],
          },
          {
            headers: {
              'X-Alchemy-Token': this.apiToken,
            },
          },
        ),
      );
      return resp.data['data'];
    } catch (e) {
      console.error('error: setTransferWebhook :', e.response?.data?.message);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async removeTransferWebhook(wallet: string, webhookId: string) {
    const url = `${this.apiDashboardUrl}/update-webhook-addresses`;
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          url,
          {
            webhook_id: webhookId,
            addresses_to_remove: [wallet],
          },
          {
            headers: {
              'X-Alchemy-Token': this.apiToken,
            },
          },
        ),
      );
      return resp.data;
    } catch (e) {
      console.error('error: setTransferWebhook :', e.response?.data?.message);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async addTransferWebhook(
    wallet: string,
    webhookId: number,
    minedWebhookId: number,
  ) {
    const url = `${this.apiDashboardUrl}/update-webhook-addresses`;
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          url,
          {
            webhook_id: webhookId,
            addresses_to_add: [wallet],
          },
          {
            headers: {
              'X-Alchemy-Token': this.apiToken,
            },
          },
        ),
      );
      const respMined = await firstValueFrom(
        this.httpService.post(
          url,
          {
            webhook_id: webhookId,
            addresses_to_add: [wallet],
          },
          {
            headers: {
              'X-Alchemy-Token': this.apiToken,
            },
          },
        ),
      );
      return [resp.data, respMined.data];
    } catch (e) {
      console.error('error: setTransferWebhook :', e.response?.data?.message);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createTransferWebhook(wallet: string, userId: string) {
    const webhookTransferRes = await this.createNewTransferWebhook(
      wallet,
      'ADDRESS_ACTIVITY',
      userId,
    );
    const webhookTransferMinedRes = await this.createNewTransferWebhook(
      wallet,
      'MINED_TRANSACTION',
      userId,
    );
    if (
      webhookTransferRes &&
      webhookTransferRes.id &&
      webhookTransferMinedRes &&
      webhookTransferMinedRes.id
    ) {
      return [webhookTransferRes, webhookTransferMinedRes];
    }
    return [null, null];
  }
}
