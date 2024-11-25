import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { ErrorHandlerService } from "./error-handler.service";
import { UserService } from "./user.service";

export const isUserLoggedInGuard = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const userService = inject(UserService)
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService);

  try {
    console.log("Auth guard reached!");
    await firstValueFrom(userService.authenticateUser());
    return true;
  } catch (error: any) {
    const parsedJsonError = JSON.parse(JSON.stringify(error.error));
    if (
      parsedJsonError.error &&
      parsedJsonError.error.code === "SESSIONTOKEN_INVALID_OR_EXPIRED"
    ) {
      auth.setRedirectUrl(state.url);
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
