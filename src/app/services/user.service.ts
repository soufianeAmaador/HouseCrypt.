import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Donation } from '../models/Donation';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { Update } from '../models/update';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User | undefined;
  private userAddress: string | undefined;
  private readonly baseUrl = "http://localhost:5050";
  private readonly userUrl = `${this.baseUrl}/user`;
  private readonly donationUrl = `${this.baseUrl}/submit-donation`;
  private readonly updateUserInfoUrl = `${this.baseUrl}/update-user`;
  private readonly loadProfileUrl = `${this.baseUrl}/get-profile`;
  private readonly authenticateUserUrl = `${this.baseUrl}/authenticate-user`;
  private readonly checkLoginUrl = `${this.baseUrl}/check-login`;
  private loginStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) { 

    this.isLoggedIn().subscribe({
      next: (isUserLoggedIn: boolean) => {
        if(isUserLoggedIn){
          console.log("loading user");
          this.authenticateUser().subscribe({
            next: (user) => {
              if(user !== undefined){
                this.loadUser().subscribe({
                  next: (user: User) => {
                    // Handle the returned user data
                    this.user = user;
                    this.userAddress = user.address;
                    console.log("user found!");
                  },
                  error: (err) => {
                    console.error("Error loading user in constructor: ", err);
                  }
                });
              }
            },
            error: (error) => {
              this.errorHandlerService.handleError(error);
            }
          })
        } 
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    })

    
  }

  //TODO call this when user has just been authenticated?
  public loadUser(): Observable<User> {
    return this.http.get<User>(this.userUrl, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).pipe(
      map((user: any) => ({
        ...user,
        donations: user.donations.map((donation: any) => ({
          ...donation,
          amount: BigInt(donation.amount), // Convert amount to BigInt
        })),
      })),
      tap((user: User) => {
        // Set the user and userAddress properties inside the service
        this.user = user;
        this.userAddress = user.address;
        this.loginStatus.next(true);
      }),
      catchError((error) => {
        this.loginStatus.next(false);
        this.errorHandlerService.handleError(error);
        throw error; 
      })
    );
  }

  public getUserByWallet(walletAddress: string): Observable<User> {
    const url = `${this.loadProfileUrl}/${walletAddress}`;  // Append the wallet address to the base user URL
    
    return this.http.get<User>(url, {
      headers: { "Content-Type": "application/json" },
    }).pipe(
      map((user: any) => ({
        ...user,
        donations: user.donations.map((donation: any) => ({
          ...donation,
          amount: BigInt(donation.amount), // Convert amount to BigInt
        })),
      })),
      catchError((error) => {
        // Handle the error, log or notify the user
        this.errorHandlerService.handleError(error);
        throw error; // Rethrow to handle in the caller (e.g., the component)
      })
    );
  }

  public updateUserInfo(user: FormData){
    console.log(user);
    this.http
    .post<FormData>(this.updateUserInfoUrl, user, {
      withCredentials: true,
    }).subscribe({
      next: (res) => { 
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    });
  }
  
  public async addDonation(donation: Donation){
    this.http
    .post<JSON>(this.donationUrl, donation, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).subscribe({
      next: (res) => { 
        console.log(res);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    });
  }

  authenticateUser(): Observable<JSON | undefined> {
    return this.http.get<JSON>(this.authenticateUserUrl, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).pipe(
      catchError(() => {
        this.loginStatus.next(false);
        return of(undefined);
        })
    )
  }

  
  isLoggedIn() {
    return this.http
      .get<boolean>(`${this.checkLoginUrl}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .pipe(
        map((response: boolean) => response) // Map response to boolean value
      );
  }


  getError() {
    return this.http
    .get(`${this.baseUrl}/error1`, {
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

  public getUser(){
    return this.user;
  }

  public getUserAddress(){
    return this.userAddress;
  }

  public setUserAddress(){
    this.userAddress = this.user ? this.user.address : "";
  }

  public clearUser(){
    this.userAddress = "";
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

}
