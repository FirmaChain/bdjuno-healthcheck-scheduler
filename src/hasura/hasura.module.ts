import { Module } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    HasuraService,
    ConfigService
  ],
  exports: [HasuraService]
})
export class HasuraModule {}