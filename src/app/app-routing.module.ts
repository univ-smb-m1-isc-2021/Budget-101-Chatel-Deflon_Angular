import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ManagingDataComponent} from "./components/managing-data/managing-data.component";

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'gestion',
    component: ManagingDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
