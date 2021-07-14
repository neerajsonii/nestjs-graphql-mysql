import { Module, OnModuleInit, Provider } from '@nestjs/common';
import { LoggerService } from '../../shared/services/logger.service';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { DataBaseModule } from '../../database/database.module';

const TOKEN = 'PRODUCT_MODULE';

@Module({
  imports: [
    SharedModule,
    DataBaseModule
  ],
  controllers: [],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule implements OnModuleInit {
  private readonly logger: LoggerService;
  constructor() {
    this.logger = new LoggerService(TOKEN);
  }

  onModuleInit() {
    this.logger.log('Module initiated and ready');
  }
}
