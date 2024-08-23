import { ConfigService } from '@nestjs/config'; // Make sure this is imported
import { DataSource } from 'typeorm';

export const DatabaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService], // Ensure ConfigService is injected
  },
];
