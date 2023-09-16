import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async setLog(data: any) {
    const logCreated = await this.prismaService.log.create({
      data: {
        action: data.action,
        userId: data.userId,
        value: JSON.stringify(data.content),
      },
    });
    console.log(`Log created ${JSON.stringify(logCreated)}`);
    return logCreated;
  }
}
