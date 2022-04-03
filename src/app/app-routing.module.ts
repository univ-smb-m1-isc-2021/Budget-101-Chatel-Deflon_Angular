import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ManagingDataComponent} from "./components/managing-data/managing-data.component";
import {LoginComponent} from "./components/login/login.component";
import {UserSettingsComponent} from "./components/user-settings/user-settings.component";

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
    path: 'connexion',
    component: LoginComponent,
  },
  {
    path: 'utilisateur',
    component: UserSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
