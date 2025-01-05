import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SiweMessage } from "siwe";
import { Observable, Subject, firstValueFrom, Subscription, finalize } from "rxjs";
import { User } from "../models/User";
import { EthereumService } from "./ethereum.service";
import { ErrorHandlerService } from "./error-handler.service";
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class AuthService implements OnInit {
  private redirectUrl: string | null = null;
  public walletAddress = new Subject<string>();
  private ethereumSubscription!: Subscription;
  private domain = window.location.host;
  private origin = window.location.origin;


  private readonly baseUrl = "http://localhost:5050";
  private readonly nonceUrl = `${this.baseUrl}/nonce`;
  private readonly verifyUrl = `${this.baseUrl}/verify`;
  private readonly refreshAccessTokenUrl = `${this.baseUrl}/refresh-access-token`;
  private readonly logoutUrl = `${this.baseUrl}/log-out`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ethereumService: EthereumService,
    private errorHandlerService: ErrorHandlerService,
    private userService: UserService
  ) {
    this.isConnected().then((_isConnected) => {
      if (!_isConnected) this.connectWallet();
    });
    this.ethereumService.noAccountsDetected.subscribe(() => {
      this.logOut(); // Call logout when no accounts are detected
    });
  }

  ngOnInit(): void {
    this.ethereumSubscription = this.ethereumService.accountsChanged.subscribe(
      (accounts: string) => {
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

  //web3login to be implemented here
  public async connectWallet() {
    console.log("connectwallet");
    try {
      // Fetch the accounts using ethereumService
      const accounts = await this.ethereumService.connectWallet();
      
      // Use the first account (currently selected in MetaMask)
      this.walletAddress.next(accounts[0]);
      localStorage.setItem("currentuser", accounts[0]);
  
      // Call sign-in and verification logic
      await this.signInWithEthereum()
        .then(() => this.sendForVerification())
        .catch((error) => {
          window.alert(error);
          this.errorHandlerService.handleError(error);
        });
  
    } catch (error: any) {
      if (error.code === 4001) {
        // User denied the connection request
        this.errorHandlerService.handleError("MetaMask is not installed!");
      } else {
        this.errorHandlerService.handleError(error);
      }
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
    try {
      const signer = await this.ethereumService.getSigner();
      console.log("signer from within: ");
      console.log(signer);
      if (signer) {
        this.message = await this.createSiweMessage(
          await signer.getAddress(),
          "Sign in with Ethereum to Housecrypt."
        );
        this.signature = await signer.signMessage(this.message);
      } else {
        throw new Error('Signer is undefined');
      }
    } catch (error) {
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
      .subscribe(async (res) => {
        console.log(res);
        // load user after verified
        await this.userService.loadUser();
      });
  }

  public async isConnected(): Promise<boolean> {
    return this.ethereumService.isConnected();
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
          console.log("finalize");
          this.walletAddress.next("");
          localStorage.removeItem("currentuser");
          this.userService.clearUser();
        })
      )
      .subscribe({
        next: () => {
          console.log("next reached!");
        },
        error: (error) => {
          console.log("error at auth.service");
          console.error('Error status:', error.status);
          console.error('Error details:', error.message);
          this.errorHandlerService.handleError(error);
        }
      });
  }

  public async refreshAccessToken(): Promise<Observable<JSON>> {
    const signer = await this.ethereumService.getSigner();
    const address = signer ? await signer.getAddress() : '';
    if (!address) {
      console.error("Sign in with your ethereum account first!");
      this.router.navigate(["/login"]);
      return new Observable<JSON>((observer) => {
        observer.error(new Error("No Ethereum address available"));
      });
    }
  
    return this.http
      .post<JSON>(this.refreshAccessTokenUrl, JSON.stringify({ address: address }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  }
  

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}
