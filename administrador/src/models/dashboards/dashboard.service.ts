import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Dashboard, DashboardType } from './dashboard.schema';
import { DashboardWidgetDTO } from './dashboardWidgetDTO';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectModel('Dashboard') private dashboardModel: Model<DashboardType>,
  ) {}

  /**
   * Inserts a dashboard in the dashboard's collection
   * @param dashboard
   * @returns
   */
  async insertDashboard(dashboardInstance: Dashboard): Promise<Dashboard> {
    //Comprobar que el code no existe
    const existingDashboard = await this.dashboardModel
      .findOne({ code: dashboardInstance.name })
      .exec();
    if (existingDashboard) {
      throw new Error('Ya existe un dashboard con ese código.');
    }
    const dashboardToinsert = new this.dashboardModel(dashboardInstance);
    return dashboardToinsert.save();
  }



  /**
   * Retrieve a dashboard from database for a given code (id)
   * @param id
   * @returns
   */
  async getDashboard(id: string): Promise<Dashboard> {
    const dashboardInstance = await this.dashboardModel
      .findOne({ name: id })
      .lean();
    return dashboardInstance;
  }



  /**
   * Updates dashboard's content
   * @param dashboard
   * @returns
   */
  async updateDashboard(dashboardInstance: Dashboard) {
    return await this.dashboardModel.findOneAndUpdate(
      { name: dashboardInstance.name },
      { $set: dashboardInstance },
      { new: true}
    );
  }



  /**
   * Updates a widget in the dashboard widget's array
   * @param dashboardId ID of the container dashboard
   * @param frame frame position of the widget
   * @param order order of the widget inside the frame
   * @param widget frame to substitute the previous one
   * @returns
   */
  async updateWidget(dashboardId: string, widget: DashboardWidgetDTO) {
    //console.log("Dashboard buscado: ", dashboardId)
    const instance = await this.dashboardModel.findOne({ name: dashboardId });
    // console.log("Dashboard encontrado: ", instance)
    const f = widget.frame;
    const o = widget.order;
    widget.frame = widget.newFrame;
    widget.order = widget.newOrder;
    delete widget.newFrame;
    delete widget.newOrder;
    widget.doc = Buffer.from(widget.doc).toString('base64');
    // console.log("Widget transformado: ", widget)
    instance.widgets = instance.widgets.map((item) =>
      item.frame == f && item.order == o ? widget : item,
    );
    //console.log("dashboard transformado: ", instance)
    return await this.dashboardModel.updateOne(
      { name: dashboardId },
      { $set: instance },
    );
  }



  /**
   * Deletes a dashboard
   * @param id code of the dashboard to delete
   * @returns
   */
  async deleteDashboard(id: string) {
    return await this.dashboardModel.deleteOne({ code: id });
  }



  /**
   * Gets the list of all dashboards
   * @returns
   */
  async getDashboardList(): Promise<Dashboard[]> {
    return await this.dashboardModel.find().lean();
  }



  /**
   * Finds a widget in a dashboard
   * @param id 
   * @param frame 
   * @param order 
   * @returns 
   */
  async getDashboardWidget(id:string, frame: number, order:number){
    try {
      const dashboard = await this.dashboardModel.findOne({ name:id });
      
      if (!dashboard) {
        throw new Error ("Dashboard no encontrado");
      } 

      const widgets = dashboard.widgets;
      const widget = widgets.find(element => element.frame == frame && element.order == order);
      
      if (!widget) {
        throw new Error ("Widget no encontrado");
      }
      return widget;
    } catch (error) {
      throw new Error ("Error al mostrar el widget");
    }
  }



  /**
   * Duplicates a dashboard
   * @param id 
   * @param nuevoNombre 
   * @returns 
   */
  async duplicateAndSaveDashboard(id: string, nuevoNombre:string, descripcion:string): Promise<Dashboard> {
    try {
      const originalDashboard = await this.dashboardModel
        .findOne({ name: id })
        .exec();
      if (!originalDashboard) {
        throw new Error('Dashboard no encontrado.');
      }

      const existingDashboard = await this.dashboardModel.findOne({ name: nuevoNombre }).exec();
      if (existingDashboard) {
        throw new Error('Ya existe un dashboard con ese nombre.');
      }

      const duplicatedDashboard = new this.dashboardModel(
        originalDashboard.toObject(),
      );

      duplicatedDashboard.name = nuevoNombre;
      duplicatedDashboard.description = descripcion;
      duplicatedDashboard._id = null;
      const savedDashboard = await duplicatedDashboard.save();

      return savedDashboard;
    } catch (error) {
      throw new Error('Error al duplicar y guardar el dashboard.');
    }
  }



  /**
   * Deletes a widget from a dashboard
   * @param id 
   * @param frame 
   */
  async deleteWidget(id: string, frame: number, order:number) {
    try {
      await this.dashboardModel.updateOne(
        { name: id },
        { $pull: { widgets: { frame, order } } },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  
  
  /**
   * Adds a widget to a dashboard
   * @param dashboardName 
   * @param frame 
   * @param widgetData 
   * @returns 
   */
  async addWidget(dashboardName: string, frame: string, widgetData: any): Promise<Dashboard> {
    try {
      const dashboard = await this.dashboardModel.findOne({ name: dashboardName });
  
      if (!dashboard) {
        throw new Error('Dashboard no encontrado');
      }

    const newWidget = {
      frame: widgetData.frame,
      order: widgetData.order,
      type: widgetData.type,
      url: widgetData.url,
      doc: widgetData.doc,
      grant: widgetData.grant,
      title: widgetData.title,
      info: widgetData.info,
      label: widgetData.label,
      js: widgetData.js,
    };

    dashboard.widgets.push(newWidget);
    const updatedDashboard = await dashboard.save();
    return updatedDashboard;
  
  } catch (error) {
    throw new Error(error.message);
  }}
}
