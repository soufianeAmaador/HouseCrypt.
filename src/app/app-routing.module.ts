import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { LogInComponent } from './components/log-in/log-in.component';

const routes: Routes = [
  {path: '', component: BodyComponent},
  {path: 'property', component: DetailPageComponent},
  {path: 'login', component: LogInComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
