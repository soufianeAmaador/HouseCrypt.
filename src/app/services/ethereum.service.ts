import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EthereumService {
  private _accountsChanged = new Subject<string[]>();

  get accountsChanged() {
    return this._accountsChanged.asObservable();
  }

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    if (typeof window !== "undefined" && window.ethereum !== undefined) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        this._accountsChanged.next(accounts);
      });
    }
  }
}
