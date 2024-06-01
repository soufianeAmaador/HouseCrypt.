import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Donation } from '../models/Donation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User | undefined;
  private userAddress: string | undefined;
  private readonly baseUrl = "http://localhost:5050";
  private readonly userUrl = `${this.baseUrl}/user`;
  private readonly donationUrl = `${this.baseUrl}/donation`;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  //TODO call this when user has just been authenticated?
  public async loadUser(){
    this.http
    .get<User>(this.userUrl, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).subscribe({
      next: (user) => { 
        console.log("this is the load user response");
        this.user = user;
        this.userAddress = user.address;
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
}
