/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from "@angular/core";
import { catchError, firstValueFrom, switchMap } from "rxjs";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth-service.service";
import { ErrorHandlerService } from "./error-handler.service";

export const isUserLoggedInGuard = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService)

  try {
    await firstValueFrom(auth.checkLogin());
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {

    // For some reason, this is the only way error objects are able to be extracted
    const parsedJsonError = JSON.parse(JSON.stringify(error.error));
    errorHandler.handleError(parsedJsonError);
    // Token is expired or no token is provided
    if (parsedJsonError.error && parsedJsonError.error.code === "ACCESSTOKEN_INVALID_OR_EXPIRED") {

      (await auth.refreshAccessToken()).subscribe({
        next: () => {
          router.navigate([state.url]);
          return true;
        },
        error: (error) => {
          console.log("after accestoken isn't valid, so is the refreshtoken");
          errorHandler.handleError(JSON.parse(JSON.stringify(error.error)));
          router.navigate(["/login"]);
        },
      });

    } else if (
      parsedJsonError.error &&
      parsedJsonError.error.code === "SESSIONTOKEN_INVALID_OR_EXPIRED"
    ) {
      // redirect to the login page
      router.navigate(["/login"]);
    } else {
      errorHandler.handleError(JSON.parse(JSON.stringify(error.error)));

      // redirect to the login page
      router.navigate(["/login"]);
    }
    return false;
  }
};
