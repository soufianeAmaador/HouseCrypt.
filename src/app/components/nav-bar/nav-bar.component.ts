import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth-service.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  isCollapsed: string = "collapse";
  addPadding: string = "ps-5";
  isLoggedIn: boolean = false;
  connectedUser: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService.walletAddress.subscribe(
      (walletAddress: string) => {
        walletAddress.length > 0
          ? this.toggleLogIn(walletAddress)
          : this.toggleLogOut();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleNavBar() {
    this.isCollapsed =
      this.isCollapsed === "collapse" ? "collapse.show" : "collapse";
    this.addPadding = this.addPadding === "ps-5" ? "" : "ps-5";
  }

  toggleLogIn(walletAddress: string) {
    this.isLoggedIn = true;
    this.connectedUser =
      walletAddress.substring(0, 5) +
      "..." +
      walletAddress.substring(38) +
      " (Disconnect)";
  }

  toggleLogOut() {
    this.isLoggedIn = false;
    this.connectedUser = "";
  }
}
