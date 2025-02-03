import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
   server: string = 'http://localhost/BDDPrueba2/controllers/tareas.controller.php?';

  constructor(public toastCtrl: ToastController, public http: HttpClient) {}

  // 🔹 Método para enviar datos al servidor (POST request)
  async postData(body: any) {
    let head = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = { headers: head,

     };

    try {
      const response = await firstValueFrom(this.http.post(this.server, JSON.stringify(body), options));
      console.log('Respuesta del Servidor:', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Error en postData:', error);
      return error;
    }
  }

  // 🔹 Método para obtener tareas
  async obtenerTareas() {
    let datos = { op: 'getTareas' };
    return await this.postData(datos);
  }

  // 🔹 Insertar nueva tarea
  async insertarTarea(nombretarea: string, fechatarea: string, estadotarea: string, materiatarea: string, idproyecto: number | null) {
    let datos = {
      op: 'insertTarea',
      nombretarea,
      fechatarea,
      estadotarea,
      materiatarea,
      idproyecto
    };
    return await this.postData(datos);
  }

  // 🔹 Actualizar tarea
  async actualizarTarea(idtarea: number, nombretarea: string, fechatarea: string, estadotarea: string, materiatarea: string, idproyecto: number | null) {
    let datos = {
      op: 'updateTarea',
      idtarea,
      nombretarea,
      fechatarea,
      estadotarea,
      materiatarea,
      idproyecto
    };
    return await this.postData(datos);
  }

  // 🔹 Eliminar tarea
  async eliminarTarea(idtarea: number) {
    let datos = { op: 'deleteTarea', idtarea };
    return await this.postData(datos);
  }

  // 🔹 Mostrar mensaje de notificación
  async showToast(msg: string, showtime: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: showtime,
      position: 'top',
    });
    toast.present();
  }

  // 🔹 Manejo de sesiones
  async createSession(id: string, valor: string) {
    await Preferences.set({ key: id, value: valor });
  }

  async getSession(id: string): Promise<string | null> {
    const { value } = await Preferences.get({ key: id });
    return value ? value.toString() : null;
  }

  async updateSession(id: string, valor: string) {
    await Preferences.set({ key: id, value: valor });
  }

  async getInfoUserSession() {
    return {
      identificationUser: await this.getSession('identificationUser'),
      nameUser: await this.getSession('nameUser'),
      surenameUser: await this.getSession('surenameUser'),
      emailUser: await this.getSession('emailUser'),
      passwordUser: await this.getSession('passwordUser'),
    };
  }

  async removeSession(id: string) {
    await Preferences.remove({ key: id });
  }

  async clearSession() {
    await Preferences.clear();
  }
}
