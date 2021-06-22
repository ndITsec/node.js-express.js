import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppMiddleware } from './middlewares/app.middleware';
import { UsersModule } from './modules/users/users.module';
import { providers } from './providers';

@Module({
  imports: [UsersModule],
  providers: [...providers, AppMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
