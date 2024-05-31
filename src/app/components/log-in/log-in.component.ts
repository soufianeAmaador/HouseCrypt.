import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async connectWallet() {
    // Load spinner
    this.isLoading = true;

    // Connect to wallet and log into backend
    await this.authService.connectWallet();

    // Get redirectUrl
    const redirectUrl = this.authService.getRedirectUrl();

    // If exists, navigate after successful login
    if (redirectUrl) {
      console.log(redirectUrl);
      this.authService.clearRedirectUrl();
      this.router.navigate([redirectUrl]);
    } else {
      // If it doesn't, navigate back to home
      this.router.navigate(["/"]);
    }

    // Stop spinner from loading
    this.isLoading = false;
  }

  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    console.log(form.value);
  }
}
