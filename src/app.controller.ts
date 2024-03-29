import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CloudinaryService } from './components/cloudinary/cloudinary.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly cloudinaryService: CloudinaryService
  ) { }
}
