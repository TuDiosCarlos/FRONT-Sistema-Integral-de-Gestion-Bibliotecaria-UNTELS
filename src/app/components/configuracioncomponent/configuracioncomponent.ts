import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracioncomponent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuracioncomponent.html',
  styleUrls: ['./configuracioncomponent.css'],
})
export class Configuracioncomponent {}
