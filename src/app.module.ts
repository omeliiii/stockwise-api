import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'stockwise.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
