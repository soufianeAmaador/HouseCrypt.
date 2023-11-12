import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BodyComponent } from './components/body/body.component';
import { PropertyService } from './services/property-service.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadPropertyComponent } from './components/upload-property/upload-property.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component'; 
import { LogInComponent } from './components/log-in/log-in.component';
import { JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
 

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
    ProfileDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [PropertyService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }

