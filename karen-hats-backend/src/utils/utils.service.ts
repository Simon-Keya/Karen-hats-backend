import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  
  // Trims and converts a string to lowercase
  formatString(str: string): string {
    return str.trim().toLowerCase();
  }

  // Formats date to a human-readable string
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Generates a random string (useful for tokens, etc.)
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Validates email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Converts an object to a query string (useful for URLs)
  objectToQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  // Generates a hash for sensitive data (e.g., passwords)
  async hashString(str: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(str, salt);
  }

  // Compares a plain text string with a hash
  async compareHash(str: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(str, hash);
  }

  // Adds delay (useful for testing or simulating delays)
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
