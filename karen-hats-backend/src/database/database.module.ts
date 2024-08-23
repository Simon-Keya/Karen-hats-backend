import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { RedisProvider } from '../providers/redis.provider';
import { DatabaseProviders } from './database.providers';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule
  ],
  providers: [
    ...DatabaseProviders,
    RedisProvider,
  ],
  exports: [
    ...DatabaseProviders,
    RedisProvider,
  ],
})
export class DatabaseModule {}
