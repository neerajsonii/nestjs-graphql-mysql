import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './shared/interceptors/response.interceptors';
import { LoggerService } from './shared/services/logger.service';
import { json } from 'express';
import { config } from './config/config';

const NEST_LOGGING = process.env.ENABLE_LOGGING;

async function bootstrap() {
  const opts: NestApplicationOptions = {};
  if (!NEST_LOGGING) {
    opts.logger = false;
  }
  const app: INestApplication = await NestFactory.create<INestApplication>(
    AppModule,
    opts,
  );
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  
  app.use(json({ limit: '100mb' }));
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors();
  if (config().enableRateLimit) {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too much requests, seems like a DDOS attack',
      }),
    );
  }
  await app.listen(config().port);
  new LoggerService('APP').log(
    `Application :: ${config().appName} is running and pointing to => ${config().env}`,
  );
}
bootstrap();
