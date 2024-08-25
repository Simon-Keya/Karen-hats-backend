import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

@Injectable()
export class ConfigService {
  // Generic method to get any environment variable
  get(key: string): string | undefined {
    return process.env[key];
  }

  // Get the application port
  getPort(): number {
    const port = this.get('PORT');
    return port ? Number(port) : 3000; // Default to port 3000 if undefined
  }

  // Get the database host
  getDatabaseHost(): string {
    return this.get('DATABASE_HOST') ?? 'localhost'; // Default to 'localhost' if undefined
  }

  // Get the database port
  getDatabasePort(): number {
    const port = this.get('DATABASE_PORT');
    return port ? Number(port) : 5432; // Default to port 5432 if undefined
  }

  // Get the database username
  getDatabaseUser(): string {
    return this.get('DATABASE_USER') ?? 'postgres'; // Default to 'postgres' if undefined
  }

  // Get the database password
  getDatabasePassword(): string {
    return this.get('DATABASE_PASSWORD') ?? ''; // Default to an empty string if undefined
  }

  // Get the database name
  getDatabaseName(): string {
    return this.get('DATABASE_NAME') ?? 'test'; // Default to 'test' if undefined
  }

  // Get the JWT secret key
  getJwtSecret(): string {
    const secret = this.get('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return secret;
  }
}
