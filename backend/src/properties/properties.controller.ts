import { Controller, Get } from '@nestjs/common';

@Controller('properties')
export class PropertiesController {
  @Get()
  getProperties() {
    // Hardcoded properties for demo
    return [
      { id: '1', address: 'Sorakhutte', price: 30000000 },
      { id: '2', address: 'Gongabu', price: 45000000 },
      { id: '3', address: 'Baneshwor', price: 25000000 },
    ];
  }
}