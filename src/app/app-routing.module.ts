import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BodyComponent } from "./components/body/body.component";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { UploadPropertyComponent } from "./components/upload-property/upload-property.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { isUserLoggedInGuard } from "./services/auth-guard.service";
import { ProjectDetailComponent } from "./components/project-detail/project-detail.component";
import { UploadProjectComponent } from "./components/upload-project/upload-project.component";

const routes: Routes = [
  { path: "", component: BodyComponent },
  { path: "home", redirectTo: "" },
  { path: "property", component: DetailPageComponent },
  { path: "login", component: LogInComponent },
  {
    path: "upload",
    component: UploadPropertyComponent,
    // canActivate: [isUserLoggedInGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [isUserLoggedInGuard],
  },
  {
    path: "project",
    component: ProjectDetailComponent
  },
  {
    path: "create",
    component: UploadProjectComponent,
    canActivate: [isUserLoggedInGuard],
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
