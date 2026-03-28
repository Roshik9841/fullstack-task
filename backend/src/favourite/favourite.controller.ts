import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favourites')
@UseGuards(JwtAuthGuard)
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  getFavourites(@Request() req) {
    return this.favouriteService.getFavourites(req.user.id);
  }

  @Post(':propertyId')
  addFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favouriteService.addFavourite(req.user.id, propertyId);
  }

  @Delete(':propertyId')
  removeFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favouriteService.removeFavourite(req.user.id, propertyId);
  }
}