import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './gateways/chat.gateway';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { WebsocketsService } from './websockets.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [WebsocketsService, ChatGateway, WsJwtAuthGuard],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
