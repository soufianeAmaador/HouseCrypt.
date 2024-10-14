import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Donation } from '../models/Donation';
import { Observable, catchError, map, tap } from 'rxjs';

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

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) { 
    console.log("loading user");
    this.loadUser();
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
        console.log("getting user: ");
        console.log(user);
      }),
      catchError((error) => {
        // Handle the error, e.g., log or show a notification
        this.errorHandlerService.handleError(error);
        throw error; // Rethrow the error to handle it in the resolver or the caller
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
        console.log("repsone");
        console.log(res);
      },
      error: (error) => {
        console.log("errorhanflu");
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

  getError() {
    return this.http
    .get(`${this.baseUrl}/error1`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
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
