/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from "@angular/core";
import { catchError, firstValueFrom, switchMap } from "rxjs";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { ErrorHandlerService } from "./error-handler.service";

export const isUserLoggedInGuard = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService)

  try {
    console.log("uth guar reached!");
    await firstValueFrom(auth.checkLogin());
    return true;
  } catch (error: any) {
    const parsedJsonError = JSON.parse(JSON.stringify(error.error));
    if (parsedJsonError.error && parsedJsonError.error.code === "ACCESSTOKEN_INVALID_OR_EXPIRED") {
      return new Promise<boolean>(async (resolve, reject) => {
        (await auth.refreshAccessToken()).subscribe({
          next: () => {
            console.log("here toch");
            router.navigate([state.url]);
            resolve(true); // Resolve the promise with true
          },
          error: (error) => {
            errorHandler.handleError(JSON.parse(JSON.stringify(error.error)));
            router.navigate(["/login"]);
            reject(false); // Reject the promise with false
          },
        });
      });
    } else if (
      parsedJsonError.error &&
      parsedJsonError.error.code === "SESSIONTOKEN_INVALID_OR_EXPIRED"
    ) {
      // Redirect to the login page
      router.navigate(["/login"]);
      return false;
    } else {
      errorHandler.handleError(JSON.parse(JSON.stringify(error.error)));
      // Redirect to the login page
      router.navigate(["/login"]);
      return false;
    }
  }
  
};
