import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import secureSession from '@fastify/secure-session';
import helmet from "@fastify/helmet";

import { join } from 'path';

import { AppModule } from './app.module';




async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const httpAdapter = app.getHttpAdapter();

  
  /**
   * Registro de la localizacion de elemenetos static
   */
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  /**
   * Resgistro de la localizacion de las vistas HTML
   */

  app.register(require("@fastify/view"),{
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
    root: join(__dirname, '..', 'views'),
    layout:"./layouts/index",
    viewExt: "hbs",
    options: {
      partials: {
        logoutBoton: '/partials/logoutBoton.hbs',
      }
    }
  });

  const port = 3000;


/*
Registro del middleware helmet para controlar la seguridad de la aplicacion. Modifica los headers para evitar vulnerabilidades HTTP.
*/

await app.register(helmet);

/**
 * Registro del gestor de sesiones
 */
  await app.register(secureSession, {
    cookieName: "myCookie",
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      httpOnly: true,
      
    }
  });

  await app.listen(port, '0.0.0.0');
  console.log();
  console.log(`app running at http://localhost:${port}`);
}
bootstrap();
