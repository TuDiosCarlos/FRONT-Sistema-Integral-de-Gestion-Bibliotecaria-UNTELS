import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Libroservice } from '../../../services/libroservice';
import { Libro } from '../../../models/libro';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.css'
})
export class LibroForm implements OnInit {

  form!: FormGroup;
  esEdicion = false;
  idLibro?: number;
  cargandoIsbn = false;
  categorias: string[] = ['TECNICO', 'REFERENCIA', 'FICCION'];

  constructor(
    private fb: FormBuilder,
    private libroService: Libroservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      isbn:       ['', [Validators.required, Validators.maxLength(20)]],
      titulo:     ['', [Validators.required, Validators.maxLength(100)]],
      autor:      ['', [Validators.required, Validators.maxLength(100)]],
      editorial:  ['', Validators.maxLength(100)],
      anio:       [null],
      categoria:  ['TECNICO', Validators.required],
      stock:      [1, [Validators.required, Validators.min(0)]],
      stockTotal: [1, [Validators.required, Validators.min(1)]],
      descripcion:['', Validators.maxLength(500)],
      recurso:    ['', Validators.maxLength(300)]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idLibro = +id;
        this.cargarLibro(this.idLibro);
      }
    });
  }

  cargarLibro(id: number): void {
    this.libroService.buscarPorId(id).subscribe({
      next: (libro) => this.form.patchValue(libro),
      error: (err) => console.error('Error al cargar libro', err)
    });
  }

  buscarPorIsbn(): void {
    const isbn = this.form.get('isbn')?.value?.trim();
    if (!isbn) {
      this.snackBar.open('Ingresa un ISBN primero', 'Cerrar', { duration: 2000 });
      return;
    }

    this.cargandoIsbn = true;
    this.libroService.registrarPorIsbn(isbn).subscribe({
      next: (libro) => {
        this.cargandoIsbn = false;
        this.form.patchValue(libro);
        this.snackBar.open('Datos cargados desde API externa ✓', 'Cerrar', { duration: 3000 });
        // Redirigir al listado ya que el backend guardó el libro
        setTimeout(() => this.router.navigate(['/libros/listar']), 1500);
      },
      error: (err) => {
        this.cargandoIsbn = false;
        this.snackBar.open('ISBN no encontrado en API externa, completa el formulario manualmente', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const libro: Libro = { ...this.form.value };

    if (this.esEdicion && this.idLibro != null) {
      libro.idLibro = this.idLibro;
      this.libroService.actualizar(libro).subscribe({
        next: () => {
          this.snackBar.open('Libro actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/libros/listar']);
        },
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.libroService.registrar(libro).subscribe({
        next: () => {
          this.snackBar.open('Libro registrado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/libros/listar']);
        },
        error: (err) => {
          const msg = err.status === 409 ? 'Ya existe un libro con ese ISBN' : 'Error al registrar';
          this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/libros/listar']);
  }
}
