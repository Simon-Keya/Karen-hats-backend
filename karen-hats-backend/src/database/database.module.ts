import { Module } from '@nestjs/common';
import { DatabaseProviders } from './providers/database.providers';
import { RedisProvider } from './providers/redis.provider';

@Module({
  providers: [...DatabaseProviders, RedisProvider],
  exports: [...DatabaseProviders, RedisProvider],
})
export class DatabaseModule {}
