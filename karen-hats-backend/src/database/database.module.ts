import { Module } from '@nestjs/common';
import { RedisProvider } from '../providers/redis.provider';
import { DatabaseProviders } from './database.providers';

@Module({
  providers: [...DatabaseProviders, RedisProvider],
  exports: [...DatabaseProviders, RedisProvider],
})
export class DatabaseModule {}
