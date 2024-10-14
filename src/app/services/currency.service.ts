import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private readonly baseUrl = 'https://min-api.cryptocompare.com/data/price';

  private readonly USD_ETH: CurrencyType = {
    fsym: 'ETH',
    tsyms: 'USD',
  };

  private readonly ETH_USD: CurrencyType = {
    fsym: 'USD',
    tsyms: 'ETH',
  };

  private readonly EUR_ETH: CurrencyType = {
    fsym: 'ETH',
    tsyms: 'EUR',
  };

  private readonly ETH_EUR: CurrencyType = {
    fsym: 'EUR',
    tsyms: 'ETH',
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  // Helper method to convert CurrencyType to HttpParams
  private createHttpParams(currencyType: CurrencyType): HttpParams {
    return new HttpParams()
      .set('fsym', currencyType.fsym)
      .set('tsyms', currencyType.tsyms);
  }

  // General method to get currency rate using HttpParams
  private async getCurrencyRate(currencyType: CurrencyType) {
    const params = this.createHttpParams(currencyType);

    return this.http.get(this.baseUrl, { params }).pipe(
      // Extract the first value from the response object (the exchange rate)
      map(response => Object.values(response)[0] as number),

      // Catch any errors and call the error handler
      catchError(error => {
        this.errorHandlerService.handleError("Failed getting exchange rate");
        return throwError(() => error); // Propagate the error
      })
    ).toPromise(); // Convert the observable to a promise for async/await
  }

  // Methods to get different currency rates

  async getEthereumPriceInDollars() {
    return 
    await 
    this.
    getCurrencyRate(
      this.USD_ETH);
  }

  async getDollarPriceInEthereum() {
    return await this.getCurrencyRate(this.ETH_USD);
  }

  async getEthereumPriceInEuro() {
    return await this.getCurrencyRate(this.ETH_EUR);
  }

  async getEuroPriceInEthereum() {
    return await this.getCurrencyRate(this.EUR_ETH);
  }
}

// Interface for CurrencyType
interface CurrencyType {
  fsym: string;
  tsyms: string;
}
