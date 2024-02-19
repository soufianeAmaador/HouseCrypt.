/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from "@angular/core";
import { catchError, firstValueFrom, switchMap } from "rxjs";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth-service.service";

export const isUserLoggedInGuard = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    await firstValueFrom(auth.checkLogin());
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {

    const errorJson = JSON.stringify(error.error);
    const parsedJsonError = JSON.parse(errorJson);

    // Token is expired or no token is provided
    if (parsedJsonError.error && parsedJsonError.error.code === "ACCESSTOKEN_INVALID_OR_EXPIRED") {
      console.log("ACCESSTOKEN_INVALID_OR_EXPIRED");

      (await auth.refreshAccessToken()).subscribe({
        next: () => {
          console.log("refreshroken successful!");
          console.log("redirectURl: " + state.url);
          router.navigate([state.url]);
          return true;
        },
        error: (error) => {
          console.log("after accestoken isn't valid, so is the refreshtoken");
          window.alert(JSON.parse(JSON.stringify(error.error)).error.code);
          router.navigate(["/login"]);
        },
      });

    } else if (
      parsedJsonError.error &&
      parsedJsonError.error.code === "SESSIONTOKEN_INVALID_OR_EXPIRED"
    ) {
      console.log("SESSIONTOKEN_INVALID_OR_EXPIRED");
      // redirect to the login page
      router.navigate(["/login"]);
    } else {
      console.log("test2");
      console.error(parsedJsonError.error.message);
      window.alert(error.error?.message);

      // redirect to the login page
      router.navigate(["/login"]);
    }
    return false;
  }
};
