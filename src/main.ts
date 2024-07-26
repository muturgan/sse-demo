import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module.js';

const APP_PORT = 8888;
const APP_HOST = '127.0.0.1';

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   await app.listen(APP_PORT, APP_HOST)
      .then(() => console.info(`App running on http://${APP_HOST}:${APP_PORT}`));

   return app;
}
export default bootstrap();
