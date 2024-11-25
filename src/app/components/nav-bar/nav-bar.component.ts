import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "src/app/models/User";
import { AuthService } from "src/app/services/auth.service";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  isCollapsed: string = "collapse";
  addPadding: string = "ps-5";
  isLoggedIn: boolean = false;
  connectedUser: string = "";
  currentUser: string | null =  "";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.userService.isLoggedIn().subscribe({
      next: (isUserLoggedIn: boolean) => {
        if(isUserLoggedIn){
          this.userService.loadUser().subscribe({
            next: (user: User) => {
              // Handle the returned user data
              this.currentUser = user.address;
              console.log("User loaded in constructor: ", user);
      
              if (
                this.currentUser !== undefined &&
                this.currentUser !== null &&
                this.currentUser.length > 0
              ){
                this.toggleLogIn(this.currentUser);
              } else{
                this.toggleLogOut();
              }
      
            },
            error: (error) => {
              this.errorHandlerService.handleError(error);
            }
          });
        }else{
          this.toggleLogOut();
        }
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    })

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
      walletAddress.substring(0, 7) +
      "..." +
      walletAddress.substring(37);
  }

  toggleLogOut() {
    this.isLoggedIn = false;
    this.connectedUser = "";
    this.authService.logOut();
  }
}
