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
  IonList,
  IonCard,
} from '@ionic/angular/standalone';
import { ServicioService } from '../services/servicio.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonLabel,
    IonInput,
    IonButton,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonSelect,
    IonSelectOption,
    IonList,
  ],
})
export class ProyectosPage implements OnInit {
  proyectos: any[] = []; // Lista de proyectos
  idproyecto: number | null = null;
  nombreproyecto: string = '';
  fechaproyecto: string = '';
  estadoproyecto: string = 'pendiente';
  materiaproyecto: string = '';
  documentosproyecto: string = '';

  constructor(
    private servicio: ServicioService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.obtenerProyectos();
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  // 🔹 Obtener todos los proyectos
  async obtenerProyectos() {
    let datos = { op: 'getProyectos' };
    try {
      const res: any = await this.servicio.postData(datos);
      if (res.success) {
        this.proyectos = res.data;
      } else {
        console.log('Error al obtener proyectos:', res.message);
      }
    } catch (error) {
      console.log('Error en la consulta:', error);
    }
  }

  // 🔹 Insertar nuevo proyecto
  async insertarProyecto() {
    // Verificar que los campos obligatorios estén completos
    if (!this.nombreproyecto || !this.fechaproyecto || !this.materiaproyecto) {
      this.servicio.showToast('Completa todos los campos obligatorios', 2000);
      return;
    }

    let datos = {
      op: 'insertProyecto',
      nombreproyecto: this.nombreproyecto,
      fechaproyecto: this.fechaproyecto,
      estadoproyecto: this.estadoproyecto || 'pendiente', // Valor predeterminado si no se selecciona estado
      materiaproyecto: this.materiaproyecto,
      documentosproyecto: this.documentosproyecto,
    };

    try {
      const res: any = await this.servicio.postData(datos);
      console.log('Respuesta del servidor:', res);

      // Verificar que la respuesta no sea null o indefinida
      if (res && res.success) {
        this.servicio.showToast('Proyecto agregado exitosamente', 2000);

        // Si obtenerProyectos() es asíncrona, usar await
        await this.obtenerProyectos();

        this.limpiarCampos();
      } else {
        this.servicio.showToast(res?.message || 'Error al insertar proyecto', 2000);
      }
    } catch (error) {
      console.error('Error al insertar proyecto:', error);
      this.servicio.showToast('Error al conectar con el servidor', 2000);
    }
  }

  // 🔹 Actualizar un proyecto existente
  async actualizarProyecto() {
    if (
      this.idproyecto &&
      this.nombreproyecto &&
      this.fechaproyecto &&
      this.materiaproyecto
    ) {
      let datos = {
        op: 'updateProyecto',
        idproyecto: this.idproyecto,
        nombreproyecto: this.nombreproyecto,
        fechaproyecto: this.fechaproyecto,
        estadoproyecto: this.estadoproyecto,
        materiaproyecto: this.materiaproyecto,
        documentosproyecto: this.documentosproyecto,
      };

      try {
        const res: any = await this.servicio.postData(datos);
        if (res.success) {
          this.servicio.showToast('Proyecto actualizado exitosamente', 2000);
          this.obtenerProyectos();
          this.limpiarCampos();
        } else {
          this.servicio.showToast(res.message, 2000);
        }
      } catch (error) {
        console.log('Error al actualizar proyecto:', error);
      }
    } else {
      this.servicio.showToast('Completa todos los campos para actualizar', 2000);
    }
  }

  // 🔹 Eliminar un proyecto
  async eliminarProyecto(idproyecto: number) {
    let datos = { op: 'deleteProyecto', idproyecto: idproyecto };

    try {
      const res: any = await this.servicio.postData(datos);
      if (res.success) {
        this.servicio.showToast('Proyecto eliminado exitosamente', 2000);
        this.obtenerProyectos();
      } else {
        this.servicio.showToast(res.message, 2000);
      }
    } catch (error) {
      console.log('Error al eliminar proyecto:', error);
    }
  }

  // 🔹 Limpiar los campos después de insertar o actualizar
  limpiarCampos() {
    this.idproyecto = null;
    this.nombreproyecto = '';
    this.fechaproyecto = '';
    this.estadoproyecto = 'pendiente';
    this.materiaproyecto = '';
    this.documentosproyecto = '';
  }
}