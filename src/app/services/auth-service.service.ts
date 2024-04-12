import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ethers } from "ethers";

import { SiweMessage } from "siwe";
import { Observable, Subject, firstValueFrom, Subscription, finalize } from "rxjs";
import { User } from "../models/User";
import { EthereumService } from "./ethereum.service";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({ providedIn: "root" })
export class AuthService implements OnInit {
  private redirectUrl: string | null = null;
  private loginStatus = new Subject<boolean>();
  public walletAddress = new Subject<string>();
  private ethereumSubscription!: Subscription;

  domain = window.location.host;
  origin = window.location.origin;
  provider = new ethers.providers.Web3Provider(window.ethereum);

  private readonly baseUrl = "http://localhost:5050";
  private readonly nonceUrl = `${this.baseUrl}/nonce`;
  private readonly verifyUrl = `${this.baseUrl}/verify`;
  private readonly checkLoginUrl = `${this.baseUrl}/check-login`;
  private readonly refreshAccessTokenUrl = `${this.baseUrl}/refresh-access-token`;
  private readonly logoutUrl = `${this.baseUrl}/log-out`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ethereumService: EthereumService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.isConnected().then((_isConnected) => {
      if (!_isConnected) this.connectWallet();
    });
  }

  ngOnInit(): void {
    this.ethereumSubscription = this.ethereumService.accountsChanged.subscribe(
      (accounts: string[]) => {
        console.log("on accounts changed");
        console.log("accounts have changed! " + accounts);
        accounts.length === 0 ? this.logOut() : this.connectWallet();
      }
    );
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }

  checkLogin(): Observable<JSON> {
    return this.http.get<JSON>(this.checkLoginUrl, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  }

  loginSuccessful(): void {
    this.loginStatus.next(true);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  //web3login to be implemented here
  public async connectWallet() {
    console.log("connectwallet");
    if (typeof window != "undefined" && window.ethereum != "undefined") {
      try {
        // if MetaMask is installed
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        this.walletAddress.next(accounts[0]);
        localStorage.setItem("currentuser", accounts[0]);

        await this.signInWithEthereum()
          .then(() => this.sendForVerification())
          .catch((error) => {
            window.alert(error);
            this.errorHandlerService.handleError(error);
          });

        this.loginStatus.next(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === 4001) {
          // MetaMask is not installed
          this.errorHandlerService.handleError("Metamask is not installed!");
        } else {
          this.errorHandlerService.handleError(error);
        }
        await this.logOut();
      }
    } else {
      await this.logOut();
    }
  }

  private getNonce(): Observable<string> {
    return this.http.get(this.nonceUrl, {
      responseType: "text",
    });
  }

  public async createSiweMessage(
    address: string,
    statement: string
  ): Promise<string> {
    const nonce = await firstValueFrom(this.getNonce());

    const message = new SiweMessage({
      domain: this.domain,
      address: address,
      statement: statement,
      uri: this.origin,
      version: "1",
      chainId: 1,
      nonce: nonce,
    });

    return message.prepareMessage();
  }

  message: string | null = null;
  signature: string | null = null;

  public async signInWithEthereum() {
    try{
      const signer = this.provider.getSigner();

      this.message = await this.createSiweMessage(
        await signer.getAddress(),
        "Sign in with Ethereum to Housecrypt."
      );
      this.signature = await signer.signMessage(this.message);
    }catch(error) {
      this.errorHandlerService.handleError("Metamask signature interrupted, try again!");
      this.logOut();
    }
  }

  public async sendForVerification() {
    this.http
      .post<User>(
        this.verifyUrl,
        JSON.stringify({ message: this.message, signature: this.signature }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
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

  public async logOut() {
    this.http
      .get<JSON>(this.logoutUrl, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          // This code will run regardless of whether the request succeeds or fails
          this.loginStatus.next(false);
          this.walletAddress.next("");
          localStorage.removeItem("currentuser");
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          this.errorHandlerService.handleError(error);
        }
      });
  }

  public async refreshAccessToken() {
    // User must be logged in and ethereum address must be present in oreder to refresh token
    const address = await this.provider.getSigner().getAddress()
    if(address.length <= 0){
      console.error("Sign in with your ethereum account first!");
      this.router.navigate(["/login"]);
    }

    return this.http
      .post<JSON>(this.refreshAccessTokenUrl, JSON.stringify({ address: address}),{
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  }
}
