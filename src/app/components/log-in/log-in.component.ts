import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Token } from '../../models/token';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    this.authService.signIn(email, password).subscribe(
      (responseData) => {
        
        let token = responseData;
        
        console.log(token);
        document.cookie = `token=${token}`;
        this.isLoading = false;
      },
      error => {
      console.log(error);
      this.isLoading = false;
      }
    );

  }

  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode; 
    console.log(form.value);
  }
}
