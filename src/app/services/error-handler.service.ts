/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomError } from '../models/Error';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastr: ToastrService) { }

  handleError(error: any): void {
    if(error instanceof HttpErrorResponse) {
      // Handle HTTP errors (e.g., 404, 500)
      this.handleHttpError(error);
    } else if (typeof error === 'string'){
      // Handle string errors
      this.showToast('Error', error);
    } else {
      // Handle other types of errors
      this.showToast('Error', 'An unexpected error occurred.');
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent){
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {

      // Server-side error
      errorMessage = `Status: ${error.status}, Message: ${error.error.error.message}`;
    }
    this.showToast('HTTP Error', errorMessage);
  }

  private showToast(title: string, message: string): void {
    this.toastr.error(message, title, {
      closeButton: true,
      timeOut: 10000,
      progressBar: true,
      positionClass: 'toast-bottom-right',

    });
  }
}
