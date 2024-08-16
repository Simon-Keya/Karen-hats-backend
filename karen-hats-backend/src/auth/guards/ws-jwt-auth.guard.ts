import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class WsJwtAuthGuard implements CanActivate, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const userId = Number(decoded.sub); // Ensure sub is cast to a number

      if (isNaN(userId)) {
        return false; // Handle cases where `sub` is not a valid number
      }

      const user = await this.userRepository.findOne({
        where: { id: userId } // Correctly use the number type for `id`
      });

      if (!user) {
        return false;
      }

      // Example role check, remove if not applicable
      // if (user.role !== 'admin') return false;

      return true;
    } catch (err) {
      return false;
    }
  }

  afterInit(server: any) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}
