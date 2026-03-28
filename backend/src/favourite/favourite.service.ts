import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourite } from './favourite.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private favouriteRepository: Repository<Favourite>,
  ) {}

  async getFavourites(userId: number): Promise<Favourite[]> {
    return this.favouriteRepository.find({ where: { userId } });
  }

  async addFavourite(userId: number, propertyId: string): Promise<Favourite> {
    const favourite = this.favouriteRepository.create({ userId, propertyId });
    return this.favouriteRepository.save(favourite);
  }

  async removeFavourite(userId: number, propertyId: string): Promise<void> {
    const favourite = await this.favouriteRepository.findOne({ where: { userId, propertyId } });
    if (!favourite) {
      throw new NotFoundException('Favourite not found');
    }
    await this.favouriteRepository.remove(favourite);
  }
}