import { Routes } from '@angular/router';
import { Estudiantecomponent } from './components/estudiantecomponent/estudiantecomponent';
import { EstudianteListar } from './components/estudiantecomponent/estudiante-listar/estudiante-listar';
import { EstudianteForm } from './components/estudiantecomponent/estudiante-form/estudiante-form';

export const routes: Routes = [

    {
        path: 'estudiantes', 
        component: Estudiantecomponent,
        children:[
            { 
              path: '', 
              redirectTo: 'listar', 
              pathMatch: 'full' 
            },

            { 
              path: 'listar', 
              component: EstudianteListar 
            },

            { 
              path: 'nuevo', 
              component: EstudianteForm 
            },

            { 
              path: 'editar/:id', 
              component: EstudianteForm 
            },
        ]
    }
];

