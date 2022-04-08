import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ManagingDataComponent} from "./components/managing-data/managing-data.component";
import {LoginComponent} from "./components/login/login.component";
import {UserSettingsComponent} from "./components/user-settings/user-settings.component";
import {RegisterComponent} from "./components/register/register.component";

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'gestion',
    component: ManagingDataComponent,
  },
  {
    path: 'utilisateur',
    component: UserSettingsComponent,
  },
  {
    path: 'connexion',
    component: LoginComponent,
  },
  {
    path: 'inscription',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
