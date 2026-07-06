import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Integrante {
  nombre: string;
  rol: string;
  imagen: string;
}

@Component({
  selector: 'app-landingcomponent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landingcomponent.html',
  styleUrl: './landingcomponent.css',
})
export class Landingcomponent {
  integrantes: Integrante[] = [
    { nombre: 'Cesar', rol: 'Backend Developer', imagen: '/integrantes/cesar.jpg' },
    { nombre: 'Carlos', rol: 'Backend Developer', imagen: '/integrantes/carlos.jpg' },
    { nombre: 'Christopher', rol: 'Backend Developer', imagen: '/integrantes/christopher.jpg' },
    { nombre: 'Jair', rol: 'Frontend Developer', imagen: '/integrantes/jair.jpg' },
    { nombre: 'Nick', rol: 'Backend Developer', imagen: '/integrantes/nick.jpg' },
    { nombre: 'Nipper', rol: 'Database Administrator', imagen: '/integrantes/nipper.jpg' },
  ];
}
