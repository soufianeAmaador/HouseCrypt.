import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token } from "../models/token";

@Injectable({providedIn: 'root'})
export class AuthService {

    private readonly backendURL: string = 'http://localhost:6060';

    constructor(private httpClient: HttpClient){}

    signIn(username: string, password: string){

        console.log("auth service sign in method reached!.: ");

        return this.httpClient.post(this.backendURL + "/login",{
            username: username,
            password: password
        }
        );
    }

    register(){

    }
}