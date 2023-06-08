import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import fetch from "node-fetch";

@Injectable()
export class HasuraService {
  private hasuraAdminSecret: string;
  private graphQlUrl: string;
  private requestOptions: any;

  private prevBlockHeight: number = 0;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.hasuraAdminSecret = this.configService.get<string>('HASURA_ADMIN_SECRET');
    this.graphQlUrl = this.configService.get<string>('GRAPH_QL_URL');

    this.requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": this.hasuraAdminSecret
      },
      body: JSON.stringify({
        "operationName": "block",
        "query": `query block {
                    block(order_by: {height: desc}, limit: 1) {
                      height
                    }
                  }`,
        "variables": {}
      })
    }
  }

  private async getBlockHeight() {
    try {
      const response = await fetch(this.graphQlUrl, this.requestOptions);
      const data = await response.json();
      const height = Number(data.data.block[0].height);

      this.logger.info(`Success to get block height from hasura. Height is ${height}`);
      return height
    } catch (e) {
      this.logger.error(`Failed to look up data in Hasura | HASURA URL - ${this.graphQlUrl}`);
      return 0;
    }
  }

  async isSameHeight() {
    const currentBlockHeight = await this.getBlockHeight();
    
    if (this.prevBlockHeight === 0) {
      this.prevBlockHeight = currentBlockHeight;
      return { isSame: false, height: 0 }
    }

    if (currentBlockHeight !== this.prevBlockHeight) {
      this.prevBlockHeight = currentBlockHeight;
      return { isSame: false, height: currentBlockHeight };
    }
    
    return { isSame: true, height: currentBlockHeight };
  }
}