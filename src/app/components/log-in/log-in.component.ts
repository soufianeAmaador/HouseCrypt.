import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}
  

  ngOnInit(): void {
  }

  async connectWallet(){
    this.isLoading = true;
    await this.authService.connectWallet();
    this.isLoading = false;
  }


  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode; 
    console.log(form.value);
  }
}
