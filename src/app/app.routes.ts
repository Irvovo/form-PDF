import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormComponent } from './components/form/form.component';
import { ExibeFormComponent } from './components/exibe-form/exibe-form.component';

export const routes: Routes = [
    {
        path: "", component: HomePageComponent
        
        
    },
    {
        path:"cadastrar", component: FormComponent
    },
    {
        path:"exibe-form", component: ExibeFormComponent
    }
];
