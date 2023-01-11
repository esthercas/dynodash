import { Injectable, Logger, ArgumentsHost } from '@nestjs/common';
import { RequestService } from './request.service';




@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly requestService : RequestService) {}

  getForm() : string {
    return 'Bienvenido!'
  }

}
