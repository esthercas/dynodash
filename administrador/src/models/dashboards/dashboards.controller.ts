import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { Dashboard } from './dashboard.schema';
import { DashboardsService } from './dashboard.service';
import { TemplatesService } from '../templates//templates.service'
import { ScriptsService } from '../scripts/scripts.service';
import { DashboardWidgetDTO } from './dashboardWidgetDTO';
import { WidgetsService } from '../widgets/widgets.service';


@Controller('dashboard')
export class DashboardsController {
  constructor(
    private dashboardService: DashboardsService,
    private templateService: TemplatesService, 
    private scriptService: ScriptsService,
    private widgetService: WidgetsService) { }

  //endpoint para obtener todos los dashboards
  @Get()
  async obtenerDashboards() {
    return await this.dashboardService.getDashboardList();
  }



  /**
   * Gets the list of all dashboards
   * @returns 
   */
  @Get('list')
  @Render('dashboards/dashboardList.hbs')
  async DashboardList() {
    console.log('En dashboardList');
    try {
      const list = await this.dashboardService.getDashboardList();
      return { title: 'List of dashboards',
               items: list
            };     
    } catch (Error) {
      console.log(Error);
    }
  }



 /**
  * Retrieve a dashboard from database for a given code (id)
  * @param dashboardId 
  * @param res 
  * @returns 
  */
 @Get('item/:id')
 async getDashboard(@Param('id') dashboardId: string, @Res() res: Response) {

   try {
     const dashboardInstance = await this.dashboardService.getDashboard(dashboardId);
     //console.log(html)
     return res.send(dashboardInstance);
   }catch(error) {
     return res.status(400).send('Dashboard no encontrado.')
   }
 }



  /**
   * Finds a widget in a dashboard
   * @param id 
   * @param frame 
   * @param order 
   * @param res 
   * @returns 
   */
  @Get('widget/:name/:frame/:order')
  async getDashboardWidget(@Param('name') name:string, @Param('frame') frame:number, @Param('order') order:number, @Res() res: Response){
    try {
      const widget = await this.dashboardService.getDashboardWidget(name,frame,order);
      console.log("Widget mostrado con exito");
      return res.status(200).send(widget);
    } catch (error) {
      return res.status(400).send('Widget no mostrado');
    }
  }



  /**
   * Renders the editor 
   * @param id 
   * @returns 
   */
  @Get('editor/:id')
  @Render('dashboards/dashboardEditor.hbs')
  async editor(@Param('id') id: string) {
    try {
        const item = await this.dashboardService.getDashboard(id);
        const templateList = await this.templateService.getTemplateList();
        const scriptsList = await this.scriptService.getScriptList();
        const widgetList = await this.widgetService.getWidgetList();
        return { title: 'Editor', dashboard: item, templates: templateList, scripts: scriptsList, widgets: widgetList  } 
      } catch (Error) {
        console.log(Error);
      }
  }



  /**
   * Inserts a dashboard in the dashboard's collection
   * @param insertarDashboard 
   * @param res 
   * @returns 
   */
  @Post('dashboard')
  //@UseFilters(new HttpExceptionFilterDB)
  async insertarDashboard(@Body() insertarDashboard: Dashboard, @Res() res: Response) {

    if (insertarDashboard == undefined) {
      //console.log('es nulo')
      throw new HttpException('No se han enviado datos para guardar.', HttpStatus.NOT_IMPLEMENTED);
    }

    if(insertarDashboard.name==="") {
      //console.log('no hay code')
      throw new HttpException('Debe asignarle un nombre al dashboard.', HttpStatus.NOT_IMPLEMENTED);
    }

    try {
      const newObject = await this.dashboardService.insertDashboard(insertarDashboard);
      return res.send({msg: 'Guardado con exito'});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }


 

  /**
   * Updates dashboard's content
   * @param dashboard 
   * @param res 
   * @returns 
   */
  @Put()
  async actualizarDashboard(@Body() dashboard: Dashboard, @Res() res: Response) {
    try {

      await this.dashboardService.updateDashboard(dashboard);
      console.log('ok')
      return res.send('Dashboard actualizado con éxito.')

    }catch(error) {
      throw Error (error);
      // return res.status(400).send('Dashboard no encontrado.')
    }
  }



  /**
   * Updates a widget in the dashboard widget's array
   * @param dashboardId 
   * @param widget 
   * @param res 
   * @returns 
   */
  @Put('widget/:id')
  async updateWidget(@Param('id') dashboardId: string,
                     @Body() widget: DashboardWidgetDTO,
                     @Res() res: Response) {
     try {
      //console.log("widget recibido: ", widget);
      await this.dashboardService.updateWidget(dashboardId, widget);
      return res.send('Widget succesfully updated');
    } catch(error) {
      return res.status(400).send('Widget not found')
    }
  }



  /**
   * Deletes a dashboard
   * @param dashboardId 
   * @param res 
   * @returns 
   */
  @Delete(':id')
  async eliminarDashboard(@Param('id') dashboardId: string, @Res() res: Response){
    try {

      await this.dashboardService.deleteDashboard(dashboardId);
      return res.send('Dashboard eliminado con éxito.')

    }catch(error) {
      return res.status(400).send('Dashboard no encontrado.')
    }
  }



  /**
   * Duplicates a dashboard
   * @param id 
   * @param nuevoNombre 
   * @param res 
   * @returns 
   */
  @Post('duplicate/:id')
  async duplicateDashboard(@Param('id') id: string, @Body('nuevoNombre') nuevoNombre:string, @Body('descripcion') descripcion:string, @Res() res: Response) {
    try {
        const savedDashboard = await this.dashboardService.duplicateAndSaveDashboard(id, nuevoNombre, descripcion);
        return res.send(savedDashboard);
    } catch (error) {
        return res.status(400).send('Error al duplicar y guardar el dashboard.');
    }
  }



  /**
   * Deletes a widget from a dashboard
   * @param name 
   * @param frame 
   * @param order 
   * @param res 
   * @returns 
   */
  @Delete('editor/:name/:frame/:order')
  async deleteWidget(
    @Param('name') name: string,
    @Param('frame') frame: number,
    @Param('order') order:number,
    @Res() res: Response,
  ) {
    try {
      await this.dashboardService.deleteWidget(name, frame, order);
      return res.send('Widget eliminado con éxito.');
    } catch (error) {
      return res.status(400).send('Widget no encontrado');
    }
  }



  /**
   * Adds a widget to a dashboard
   * @param name 
   * @param frame 
   * @param widgetData 
   * @returns 
   */
  @Post('add/:name/:frame')
  async addWidget(
    @Param('name') name: string,
    @Param('frame') frame: string,
    @Body() widgetData: DashboardWidgetDTO,
  ) {
    try {
      const updatedDashboard = await this.dashboardService.addWidget(name, frame, widgetData);
      return { success: true, data: updatedDashboard };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
}