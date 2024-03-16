import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { BodyComponent } from "./components/body/body.component";
import { PropertyService } from "./services/property-service.service";
import { HttpClientModule } from "@angular/common/http";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UploadPropertyComponent } from "./components/upload-property/upload-property.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ProfileDetailComponent } from "./components/profile-detail/profile-detail.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { EthereumService } from "./services/ethereum.service";
import { ErrorHandlerService } from "./services/error-handler.service";
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PledgeModalComponent } from './components/pledge-modal/pledge-modal.component';
import { UploadProjectComponent } from './components/upload-project/upload-project.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    BodyComponent,
    LogInComponent,
    DetailPageComponent,
    UploadPropertyComponent,
    LoadingSpinnerComponent,
    ProfileComponent,
    PageNotFoundComponent,
    ProfileDetailComponent,
    ProjectDetailComponent,
    CarouselComponent,
    PledgeModalComponent,
    UploadProjectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
  ],
  providers: [PropertyService, EthereumService, ErrorHandlerService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
