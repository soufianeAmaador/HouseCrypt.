import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";
import { inject } from "@angular/core";
import { User } from "../models/User";


export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>=>{
    console.log("user service load user!");
    const userService = inject(UserService);
    return userService.loadUser();
}