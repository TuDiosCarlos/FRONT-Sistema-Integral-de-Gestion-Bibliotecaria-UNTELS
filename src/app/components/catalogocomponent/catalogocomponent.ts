import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogocomponent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogocomponent.html',
  styleUrls: ['./catalogocomponent.css'],
})
export class Catalogocomponent {}
