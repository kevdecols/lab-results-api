import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe()); // (opcional) Agrega una tubería global para validar las solicitudes de entrada.
  // app.setGlobalPrefix('api');
  // app.enableCors({
  //   origin: '*',
  //   methods: '*',
  //   credentials: true,
  // });

  // Configuración de CORS
  const allowedOrigins: string[] = [
    'http://localhost:4200',
    'http://localhost:3001',
  ];

  // Agrega los orígenes permitidos aquí

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      console.log('origin: ' + origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.enableCors(corsOptions);

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', allowedOrigins);
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type');
  //   next();
  // });

  const configService = app.get(ConfigService);
  const port = +configService.get<number>(SERVER_PORT) || 3000;
  await app.listen(port);
  console.log(`Listening on port ${await app.getUrl()}`);
}
bootstrap();
