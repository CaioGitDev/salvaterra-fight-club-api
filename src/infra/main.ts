import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  // TODO: add localhost to cors

  app.enableCors({
    origin: ['http://localhost:3000'], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port)
}
bootstrap()
