import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ManagingDataComponent} from "./components/managing-data/managing-data.component";
import {LoginComponent} from "./components/login/login.component";
import {UserSettingsComponent} from "./components/user-settings/user-settings.component";
import {RegisterComponent} from "./components/register/register.component";

const routes: Routes = [
  {
    // Page d'accueil
    path: '',
    component: HomepageComponent
  },
  {
    // Page pour gérer les budgets et dépenses
    path: 'gestion',
    component: ManagingDataComponent
  },
  {
    // Page pour gérer les informations utilisateur
    path: 'utilisateur',
    component: UserSettingsComponent
  },
  {
    // Page de connexion
    path: 'connexion',
    component: LoginComponent,
  },
  {
    // Page d'inscription
    path: 'inscription',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
