import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Estudianteservice } from '../../../services/estudianteservice';
import { Carreraservice } from '../../../services/carreraservice';
import { StudentDTO } from '../../../models/student';
import { Carrera } from '../../../models/carrera';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.css'
})
export class EstudianteForm implements OnInit {

  form!: FormGroup;
  carreras: Carrera[] = [];
  modoEdicion = false;
  estudianteId?: number;

  constructor(
    private fb: FormBuilder,
    private estudianteService: Estudianteservice,
    private carreraService: Carreraservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombres:   ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni:       ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      codigo:    ['', [Validators.required]],
      email:     ['', [Validators.required, Validators.email]],
      carreraId: [null, [Validators.required]],
    });

    this.cargarCarreras();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.estudianteId = +id;
      this.cargarEstudiante(this.estudianteId);
    }
  }

  cargarCarreras(): void {
    this.carreraService.listar().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras', err)
    });
  }

  // FIX: implementación correcta del método que estaba vacío
  cargarEstudiante(id: number): void {
    // Buscamos el estudiante por su página (no hay endpoint getById en el servicio actual,
    // usamos buscarPorCodigo no aplica aquí, así que listamos y filtramos)
    this.estudianteService.listar(0, 1000).subscribe({
      next: (page) => {
        const est = page.content.find(e => e.id === id);
        if (est) {
          this.form.patchValue({
            nombres:   est.nombres,
            apellidos: est.apellidos,
            dni:       est.dni,
            codigo:    est.codigo,
            email:     est.email,
            carreraId: est.carrera?.id ?? null,
          });
        } else {
          this.snackBar.open('Estudiante no encontrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/estudiantes/listar']);
        }
      },
      error: () => this.snackBar.open('Error al cargar el estudiante', 'Cerrar', { duration: 3000 })
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: StudentDTO = this.form.value;

    const peticion = this.modoEdicion && this.estudianteId
      ? this.estudianteService.actualizar(this.estudianteId, dto)
      : this.estudianteService.registrar(dto);

    peticion.subscribe({
      next: () => {
        this.snackBar.open(
          this.modoEdicion ? 'Estudiante actualizado correctamente' : 'Estudiante registrado correctamente',
          'Cerrar', { duration: 3000 }
        );
        this.router.navigate(['/estudiantes/listar']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Error al guardar el estudiante';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}