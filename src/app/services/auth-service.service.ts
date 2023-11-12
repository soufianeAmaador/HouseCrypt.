import { HttpBackend } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService implements OnInit {
  public isLoggedIn: boolean = false;
  private isInstalled: boolean = false;
  private redirectUrl: string | null = null;
  public walletAddress = new Subject<string>();

  constructor(
    private jwtHelper: JwtHelperService,
    private http: HttpBackend,
    private router: Router
  ) {
    this.isConnected().then((_isConnected) => {
      if (_isConnected) this.connectWallet();
    });
  }

  ngOnInit(): void {
    window.ethereum.on("accountsChanged", this.onAccountsChanged);
  }

  //TODO create an intermediary that decides to redirect
  public async redirectAfterLogIn() {
    //If connection is successful, redirect to desired URL or home
    await this.connectWallet();
    if (await this.isConnected()) {
      if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl]);
        this.redirectUrl = null;
      } else {
        this.router.navigate(["/home"]);
      }
    }
  }

  //TODO finish this function
  public isAuthenticated(url: string | null): boolean {
    //const token = localStorage.getItem("token");
    // Check whether the token is expired and return
    // true or false
    //if (this.jwtHelper.isTokenExpired(token)) return true;
    if (this.isLoggedIn) return true;
    this.redirectUrl = url;

    //navigate login page
    this.redirectAfterLogIn();

    return false;
  }

  //web3login to be implemented here
  public async connectWallet() {
    if (typeof window != "undefined" && window.ethereum != "undefined") {
      // if MetaMask is installed
      await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((_accounts: string[]) => {
          this.walletAddress.next(_accounts[0]);
          this.isLoggedIn = true;
        })
        .catch((error: { code: number }) => {
          if (error.code === 4001) {
            // MetaMask is not installed
            window.alert("Metamask is not installed!");
          } else {
            console.error(error);
          }
        });
    } else {
      this.isLoggedIn = false;
    }
  }

  public onAccountsChanged(accounts: string[]) {
    console.log("accounts has changed!");
    accounts.length === 0 ? this.disconnectWallet() : this.connectWallet();
  }

  public async isConnected(): Promise<boolean> {
    let _isConnected: boolean = false;
    await window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        _isConnected = accounts.length !== 0;
      });
    return _isConnected;
  }

  public async disconnectWallet() {
    this.isLoggedIn = false;
    this.walletAddress.next("");
  }

  public logOut() {}
}
