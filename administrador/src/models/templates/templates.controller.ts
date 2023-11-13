import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, Render, UseFilters, Redirect } from '@nestjs/common';
import { Response } from 'express';
//import { HttpExceptionFilterDB } from 'src/common/exceptionFilters/globalFilterExpress';
import { CrearTemplateDTO } from './templateDTO';
import { TemplatesService } from './templates.service';
import { Template } from './template.schema';


/**
 * 
 */
@Controller('template')
export class TemplatesController {
  constructor(private templateService: TemplatesService) { }

  /**
   * 
   * @returns 
   */
  @Get()
  async getTemplates() {
    return await this.templateService.getTemplateList();
  }


  /**
   * 
   * @returns 
   */
  @Get('list')
  @Render('templates/templateList.hbs')
  async templateList() {
    console.log('En templateList');
    try {
      const list = await this.templateService.getTemplateList();
      //const list2 = list.map(i => i.code);
      //console.log(list2);
      return { title: 'List of templates',
               items: list
            };     
    } catch (Error) {
      console.log(Error);
    }
  }


  
  /**
   * 
   * @param id 
   * @returns 
   */
  @Get('item/:id')
  async templateItem(@Param('id') id: string) {
    console.log('En templateItem');
    try {
      const item = await this.templateService.getTemplate(id);
      return item;
    } catch (Error) {
      console.log(Error);
    }
  }

  
  
  /**
   * 
   * @param id 
   * @returns 
   */
  @Get('editor/:id')
  @Render('templates/templateEditor.hbs')
  editor(@Param('id') id: string) {
    return { title: 'Editor', template: id };
  }



  /**
   * Renderiza la pagina de confirmacion
   * @param id 
   * @returns 
   */
  @Get('delete/:id')
  @Render('templates/templateDelete.hbs')
  delete(@Param('id') id:string){
    return { title:'Delete', template : id};
  }

  /**
   * Maneja la solicitud POST para eliminar el template.
   * Redirige a la lista de templates
   * @param id ID del template a eliminar
   * @returns Redirige a la lista de templates después de la eliminación
   */
  @Post('delete/:id')
  @Redirect('/template/list')
  async deleteTemplate(@Param('id') id: string) {
    await this.templateService.deleteTemplate(id);
  }



  /**
   * Renderiza la pagina de creacion de templates
   * @param id 
   * @returns 
   */
  @Get('add')
  @Render('templates/templateAdd.hbs')
    addTemplate(@Param('id') id: string) {
        return { title:'Añadir', template : id};
    }

  /**
   * Maneja la solicitud POST para crear el template
   * Redirige a la lista de templates
   * @param id 
   * @returns 
   */
  @Post('add')
  @Redirect('/template/list')
    async createTemplate(@Body() templateData: Template) {
      await this.templateService.createTemplate(templateData);
    }


    
  /**
   * 
   * @param insertarTemplate 
   * @param res 
   * @returns 
   */
  @Post()
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarTemplate(@Body() insertarTemplate: CrearTemplateDTO, @Res() res: Response) {

    const { name, content} = insertarTemplate
    if (insertarTemplate == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(name==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al dashboard.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(content === "") {
      //console.log('no hay content')
      throw new HttpException('Debe crear un dashboard previamente.', HttpStatus.NOT_IMPLEMENTED);
    }
    try {
      const newObject = await this.templateService.insertTemplate(insertarTemplate);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }



  /**
   * endpoint para actualizar un dashboard
   * @param template 
   * @param res 
   * @returns 
   */
  @Put()
  async actualizarTemplate(@Body() template: CrearTemplateDTO, @Res() res: Response) {
    try {
      await this.templateService.updateTemplate(template);
      console.log('Template actualizado con éxito.')
      return res.send('ok')

    } catch(error) {
      return res.status(400).send('Template no encontrado.')
    }
  }



  /**
   * endpoint para eliminar un dashboard
   * @param dashboardId 
   * @param res 
   * @returns 
   */
  @Delete(':id')
  async eliminarDashboard(@Param('id') dashboardId: string, @Res() res: Response){
    try {

      await this.templateService.deleteTemplate(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }

}
