import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretSantaComponent } from './components/secret-santa/secret-santa.component';

const routes: Routes = [
  {
    path: '',
    component: SecretSantaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
