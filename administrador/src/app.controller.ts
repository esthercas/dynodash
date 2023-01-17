import { Controller, Render, Get, Post, Req, Session, UseGuards, UseFilters, Res } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session';

import { AppService } from './app.service';
import {
  LocalAuthGuard,
  AthenticatedSession
} from "./gards";
import { AuthService } from './auth/auth.service';

import { HttpExceptionFilter } from './common/exceptionFilters/globalFilterExpress';
import { Response } from 'express';
import { FastifyExceptionFilter } from './common/exceptionFilters/globalFilterFastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) { }

  @Get()
  @Render('main.hbs')
  root(@Session() session: secureSession.Session) {
    console.log("En root")
    console.log(session)
    return {title: "Pagina web"}
  }

  @Get('error400')
  @Render('error400.hbs')
  error400(@Res() res: Response) {
     return {title: "Error 400"}
  }

  @Get('error401')
  @Render('error401.hbs')
  error401(@Res() res: Response) {
     return {title: "Error 401"}
  }

  @Get('error403')
  @Render('error403.hbs')
  error403(@Res() res: Response) {
     return {title: "Error 403"}
  }

  @Get('error404')
  @Render('error404.hbs')
  error404(@Res() res: Response) {
     return {title: "Error 404"}
  }

  @UseGuards(LocalAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @Post('auth/login')
  @Render('layouts/loggin.hbs')
  async login(@Req() req, @Session() session: secureSession.Session,@Res() resp: Response) {
      const visits = session.get('visits');
      session.set('visits', visits ? visits + 1 : 1);
      session.authenticated = true;
      const username = req.body.username;
      session.user = username;

      console.log("En login")
      console.log(session)

      return {title: username}

  }

  @UseGuards(AthenticatedSession)
  @Get('profile')
  @UseFilters(new HttpExceptionFilter())
  @Render('layouts/index.hbs')
  async getProfile(@Req() req) {
    return { body: req.session.user,
            title: req.session.user };
  }

  @Post('logout')
  async eleiminarSesion(@Session() session: secureSession.Session, @Res() resp: Response) {
    session.delete();
    console.log("En logout")
    console.log(session)
    resp.status(302).redirect('/') 
    return session;
  }


}
