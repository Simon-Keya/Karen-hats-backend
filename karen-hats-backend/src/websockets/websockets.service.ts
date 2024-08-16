import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketsService {
  private activeClients: Map<string, string> = new Map();

  addClient(clientId: string, userId: string) {
    this.activeClients.set(clientId, userId);
  }

  removeClient(clientId: string) {
    this.activeClients.delete(clientId);
  }

  getUserIdByClientId(clientId: string): string | undefined {
    return this.activeClients.get(clientId);
  }
}
