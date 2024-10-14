import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BodyComponent } from "./components/body/body.component";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { isUserLoggedInGuard } from "./services/auth-guard.service";
import { ProjectDetailComponent } from "./components/project-detail/project-detail.component";
import { UploadProjectComponent } from "./components/upload-project/upload-project.component";
import { userResolver } from "./services/userResolver.service";

const routes: Routes = [
  { path: "", component: BodyComponent },
  { path: "home", redirectTo: "" },
  { path: "property", component: DetailPageComponent },
  { path: "login", component: LogInComponent },

  {
    path: "profile",
    component: ProfileComponent,
    resolve: { user: userResolver },
    canActivate: [isUserLoggedInGuard],
  },
  {
    path: "project",
    component: ProjectDetailComponent,
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
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
