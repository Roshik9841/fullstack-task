import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './favourite.entity';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite])],
  providers: [FavouriteService],
  controllers: [FavouriteController],
})
export class FavouriteModule {}