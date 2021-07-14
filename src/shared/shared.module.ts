import { Module, OnModuleInit } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

const TOKEN = 'SHARED_MODULE';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule implements OnModuleInit {
  private readonly logger: LoggerService;
  constructor() {
    this.logger = new LoggerService(TOKEN);
  }

  onModuleInit() {
    this.logger.log('Module initiated and ready');
  }
}
