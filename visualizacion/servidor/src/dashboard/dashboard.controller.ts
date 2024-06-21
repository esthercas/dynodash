import {
  Controller,
  Get,
  Render,
  HttpException,
  HttpStatus,
  Param,
  UseFilters,
  Request,
  ForbiddenException,
  Post,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';

import { DashboardService } from './dashboard.service';
import { AppService } from 'src/app.service';
/*/import {
  CrearDashboardDTO,
  CrearDocumentDTO,
  CrearScriptDTO,
  CrearTemplateDTO,
  CrearWidgetDTO,
} from './dto';
*/
@Controller('page')
export class DashboardController {
  constructor(
    private dbService: DashboardService,
  ) {}


  /**
   * 
   * @param dashboardId 
   * @param res 
   * @returns 
   */
  @Get('id/:pageId')
  async obtenerHTML(
    @Param('pageId') dashboardId: string,
    @Res() res: Response,
  ) {
    try {
      console.log("pageid", dashboardId)
      const { html, description }= await this.dbService.getHTML(dashboardId);
      return res.render('main', {
          html: html,
          title: description,
      });
    } catch (Error) {
      console.log(Error);
    }
  }
}
