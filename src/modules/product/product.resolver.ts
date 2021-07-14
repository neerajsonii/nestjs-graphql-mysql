
import { Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../shared/services/logger.service';
import { ProductService } from './product.service';

const TOKEN = 'PRODUCT_RESOLVER';

@Resolver()
export class ProductResolver {
    private readonly logger: LoggerService;
    constructor(private productService: ProductService) {
        this.logger = new LoggerService(TOKEN);
    }

}