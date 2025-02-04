import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  ModalController,
  IonButton,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonSelect,
  IonSelectOption,
  NavController,
  IonList,
  IonCard
} from '@ionic/angular/standalone';
import { ServicioService } from '../services/servicio.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
  standalone: true,
  imports: [
    IonCard, IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonLabel, IonInput, IonButton,
    IonItem, IonItemGroup, IonItemDivider, IonSelect, IonSelectOption, IonList
  ],
})
export class TareasPage implements OnInit {
  tareas: any[] = []; // Lista de tareas
  idtarea: number | null = null;
  nombretarea: string = '';
  fechatarea: string = '';
  estadotarea: string = 'pendiente';
  materiatarea: string = '';
  idproyecto: number | null = null;

  constructor(
    private servicio: ServicioService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.obtenerTareas();
  }

cancelar() {
  this.navCtrl.navigateBack('/home');
}
  // 🔹 Obtener todas las tareas
  async obtenerTareas() {
    let datos = { op: 'getTareas' };
    try {
      const res: any = await this.servicio.postData(datos);
      if (res.success) {
        this.tareas = res.data;
      } else {
        console.log('Error al obtener tareas:', res.message);
      }
    } catch (error) {
      console.log('Error en la consulta:', error);
    }
  }

 // 🔹 Insertar nueva tarea
async insertarTarea() {
  // Verificar que los campos obligatorios estén completos
  if (!this.nombretarea || !this.fechatarea || !this.materiatarea) {
    this.servicio.showToast('Completa todos los campos obligatorios', 2000);
    return;
  }

  let datos = {
    op: 'insertTarea',
    nombretarea: this.nombretarea,
    fechatarea: this.fechatarea,
    estadotarea: this.estadotarea || 'pendiente', // Valor predeterminado si no se selecciona estado
    materiatarea: this.materiatarea,
    idproyecto: this.idproyecto
  };

  try {
    const res: any = await this.servicio.postData(datos);
    console.log('Respuesta del servidor:', res);

    // Verificar que la respuesta no sea null o indefinida
    if (res && res.success) {
      this.servicio.showToast('Tarea agregada exitosamente', 2000);
      
      // Si obtenerTareas() es asíncrona, usar await
      await this.obtenerTareas();
      
      this.limpiarCampos();
    } else {
      this.servicio.showToast(res?.message || 'Error al insertar tarea', 2000);
    }
  } catch (error) {
    console.error('Error al insertar tarea:', error);
    this.servicio.showToast('Error al conectar con el servidor', 2000);
  }
}


  // 🔹 Actualizar una tarea existente
  async actualizarTarea() {
    if (this.idtarea && this.nombretarea && this.fechatarea && this.materiatarea) {
      let datos = {
        op: 'updateTarea',
        idtarea: this.idtarea,
        nombretarea: this.nombretarea,
        fechatarea: this.fechatarea,
        estadotarea: this.estadotarea,
        materiatarea: this.materiatarea,
        idproyecto: this.idproyecto
      };

      try {
        const res: any = await this.servicio.postData(datos);
        if (res.success) {
          this.servicio.showToast('Tarea actualizada exitosamente', 2000);
          this.obtenerTareas();
          this.limpiarCampos();
        } else {
          this.servicio.showToast(res.message, 2000);
        }
      } catch (error) {
        console.log('Error al actualizar tarea:', error);
      }
    } else {
      this.servicio.showToast('Completa todos los campos para actualizar', 2000);
    }
  }

  // 🔹 Eliminar una tarea
  async eliminarTarea(idtarea: number) {
    let datos = { op: 'deleteTarea', idtarea: idtarea };

    try {
      const res: any = await this.servicio.postData(datos);
      if (res.success) {
        this.servicio.showToast('Tarea eliminada exitosamente', 2000);
        this.obtenerTareas();
      } else {
        this.servicio.showToast(res.message, 2000);
      }
    } catch (error) {
      console.log('Error al eliminar tarea:', error);
    }
  }

  // 🔹 Limpiar los campos después de insertar o actualizar
  limpiarCampos() {
    this.idtarea = null;
    this.nombretarea = '';
    this.fechatarea = '';
    this.estadotarea = 'pendiente';
    this.materiatarea = '';
    this.idproyecto = null;
  }
}
