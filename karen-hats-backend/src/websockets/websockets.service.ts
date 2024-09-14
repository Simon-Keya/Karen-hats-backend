import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WebsocketsService {
  constructor(private readonly jwtService: JwtService) {}

  // Method to generate a JWT token for a given user ID
  generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  // Method to validate a JWT token and return the decoded payload
  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
