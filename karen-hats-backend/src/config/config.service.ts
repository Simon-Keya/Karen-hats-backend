import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string | undefined } = process.env;

  get(key: string): string | undefined {
    return this.envConfig[key];
  }

  getPort(): number {
    return Number(this.get('PORT')) || 3000;
  }

  getDatabaseHost(): string {
    return this.get('DATABASE_HOST') || 'localhost';
  }

  getDatabasePort(): number {
    return Number(this.get('DATABASE_PORT')) || 5432;
  }

  getDatabaseUser(): string {
    return this.get('DATABASE_USER') || 'postgres';
  }

  getDatabasePassword(): string {
    return this.get('DATABASE_PASSWORD') || 'password';
  }

  getDatabaseName(): string {
    return this.get('DATABASE_NAME') || 'karenhats';
  }

  getJwtSecret(): string {
    return this.get('JWT_SECRET') || 'secretKey';
  }
}
