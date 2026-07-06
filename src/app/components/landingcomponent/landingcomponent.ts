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
    { nombre: 'Cesar', rol: 'Product Owner', imagen: '/integrantes/cesar.jpg' },
    { nombre: 'Carlos', rol: 'Developer', imagen: '/integrantes/carlos.jpg' },
    { nombre: 'Christopher', rol: 'Developer', imagen: '/integrantes/christopher.jpg' },
    { nombre: 'Jair', rol: 'Developer', imagen: '/integrantes/jair.jpg' },
    { nombre: 'Nick', rol: 'Developer', imagen: '/integrantes/nick.jpg' },
    { nombre: 'Nipper', rol: 'Scrum Master', imagen: '/integrantes/nipper.jpg' },
  ];
}
