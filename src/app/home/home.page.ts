import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelectOption,
  IonButton,
  IonList,
  LoadingController,
  IonLoading,
  NavController,
  ModalController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../services/servicio.service';
import { TareasPage } from '../tareas/tareas.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonInput,
    IonCard,
    IonCardHeader,
    IonSelectOption,
    IonList,
    IonCardTitle,
    CommonModule,
    IonCardContent,
    IonButton,
    IonLoading,
    FormsModule,
  ],
})
export class HomePage implements OnInit {
  txt_usuario: string = '';
  txt_clave: string = '';
  msgWS: string = '';
  proyectos: any[] = [];
  tareas: any[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private servicio: ServicioService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.restartInterface();
    this.cargarProyectos();
    this.cargarTareas();
  }

  restartInterface() {
    this.txt_usuario = '';
    this.txt_clave = '';
    this.msgWS = '';
    this.servicio.clearSession();
  }

  async login() {
    let datos = {
      op: 'login',
      ci_persona: this.txt_usuario,
      clave_persona: this.txt_clave,
    };
    console.log('datos to login: ' + JSON.stringify(datos));

    try {
      const res: any = await this.servicio.postData(datos,'tareas');
      if (res.success) {
        this.servicio.createSession('identificationUser', res.data.ci_persona);
        this.servicio.createSession('nameUser', res.data.nom_persona);
        this.servicio.createSession('surenameUser', res.data.ape_persona);
        this.servicio.createSession('emailUser', res.data.correo_persona);
        this.servicio.createSession('passwordUser', res.data.clave_persona);
        this.navCtrl.navigateForward('/menu');
      } else {
        this.servicio.showToast(res.message, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createUser() {
    console.log('createUser');
    const modal = await this.modalCtrl.create({
      component: TareasPage,
    });
    return await modal.present();
  }

  recoverPassword() {
    this.navCtrl.navigateForward('/recoverypass');
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000,
    });
    loading.present();
  }

  insertarTarea() {
    this.navCtrl.navigateForward('/tareas');
  }

  insertarProyecto() {
    this.navCtrl.navigateForward('/proyectos');
  }

  // 🔹 Cargar la lista de proyectos
  async cargarProyectos() {
    try {
      const res: any = await this.servicio.obtenerProyectos();
      if (res) {
        this.proyectos = res;
      } else {
        console.log('Error al obtener proyectos:', res.message);
      }
    } catch (error) {
      console.log('Error en la consulta de proyectos:', error);
    }
  }

  // 🔹 Cargar la lista de tareas
  async cargarTareas() {
    try {
      const res: any = await this.servicio.obtenerTareas();
      if (res) {
        this.tareas = res;
        console.log('Tareas cargadas:', this.tareas);
      } else {
        console.log('Error al obtener tareas:', res.message);
      }
    } catch (error) {
      console.log('Error en la consulta de tareas:', error);
    }
  }
}
