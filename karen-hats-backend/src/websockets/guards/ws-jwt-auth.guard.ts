import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      const decoded = this.jwtService.verify(token);
      // Perform any additional validation if needed, e.g., checking user roles
      return !!decoded; // return true if the token is valid
    } catch (err) {
      return false; // return false if token verification fails
    }
  }
}
