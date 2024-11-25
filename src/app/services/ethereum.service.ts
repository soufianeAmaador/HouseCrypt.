import { Injectable } from "@angular/core";
import { ethers } from "ethers";
import {Decimal} from 'decimal.js';
import { Subject } from "rxjs";
import { environment } from '../../environments/environment';
import { Project } from "../models/Project";
import { CurrencyService } from "./currency.service";

@Injectable({
  providedIn: "root",
})
export class EthereumService {
  private _accountsChanged = new Subject<string[]>();
  public provider: ethers.providers.Web3Provider | undefined;
  private contract: ethers.Contract | undefined;


  get accountsChanged() {
    return this._accountsChanged.asObservable();
  }

  constructor(private currencyService: CurrencyService) {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this._accountsChanged.next(accounts);
      });
      this.contract = new ethers.Contract(
        environment.contractAddress,
        environment.contractAbi,
        this.provider.getSigner()
      );
    } else {
      console.error('MetaMask is not installed');
    }
  }

  async connectWallet(): Promise<string[]> {
    if (this.provider) {
      const accounts: string[] = await this.provider.send('eth_requestAccounts', []);
      return accounts;
    } else {
      throw new Error('MetaMask is not installed');
    }
  }

  async getSigner() {
    return this.provider?.getSigner();
  }

  async isConnected(): Promise<boolean> {
    if(this.provider !== undefined){
      const accounts: string[] = await this.provider.send('eth_accounts', []);
      return accounts.length > 0;
    }else{
      return false;
    }
    
  }

  async convertToEther(pledgeAmountDollar: Decimal): Promise<string> {
    if (pledgeAmountDollar !== undefined && pledgeAmountDollar.gt(new Decimal(0.0))) {
      // Get the current exchange rate (ETH to USD)
      const exchangeRate = await this.currencyService.getEthereumPriceInDollars();
      console.log("This is the exchange rate: ", exchangeRate);
      console.log("This is the dollar amount: ", pledgeAmountDollar.toString());
  
      if (exchangeRate === undefined || exchangeRate === 0) {
        throw new Error("Invalid exchange rate received");
      }
  
      // Use Decimal for exchange rate to avoid precision loss
      const exchangeRateDecimal = new Decimal(exchangeRate);
      const etherValue = pledgeAmountDollar.div(exchangeRateDecimal); // Dividing pledge amount by exchange rate
      console.log("This is the ether value: ", etherValue.toString());
  
      // Return the ether value as a string with 6 decimal places
      return etherValue.toFixed(6); // Ensures precision to 6 decimal places
    } else {
      return '0.000000';
    }
  }
  

async convertToWei(pledgeAmountDollar: Decimal){
  if (!(pledgeAmountDollar instanceof Decimal)) {
    pledgeAmountDollar = new Decimal(pledgeAmountDollar);
  }

  if (pledgeAmountDollar !== undefined && pledgeAmountDollar.gt(new Decimal(0.0))) {
    const etherAmount = await this.convertToEther(pledgeAmountDollar);
    const weiAmount = ethers.utils.parseUnits(etherAmount, "ether");

    // Convert the BigNumber to bigint
    return BigInt(weiAmount.toString());

  } else {
    return 0n;
  }
}

async convertToDollars(weiAmount: bigint): Promise<string> {
  if (weiAmount !== undefined && weiAmount > 0n) {

    const exchangeRate = await this.currencyService.getEthereumPriceInDollars(); 
    // Convert Wei to Ether 
    const etherAmount = ethers.utils.formatUnits(weiAmount.toString(), "ether");
    // Convert Ether to USD using the exchange rate
    const dollarValue = parseFloat(etherAmount) * exchangeRate!;
    
    return dollarValue.toFixed(2); // Show dollar value up to 2 decimal places
  } else {
    return "0.00";
  }
}


  async pledge(projectId: string, amount: bigint) {
    console.log("Pledging ethers: " + amount);
    console.log(this.contract);
    console.log(projectId);

    if (this.contract != undefined) {
      try {
        const response = await this.contract["pledge"](1, { value: amount });
        console.log("Transaction response:", response);
        return response;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
      }
    } else {
      console.error("Contract is not initialized.");
    }
  }

  private convertToUnixTimestamp(dateString: Date): number {
    const date = new Date(dateString);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return unixTimestamp;
  }

  async createProject(project: Project) {
    console.log("Creating project:");

    const dateString = project.projectDeadline;
    console.log("Datestring" + dateString);
    const unixTimestamp = this.convertToUnixTimestamp(dateString);
    console.log("unixTimestamp" + unixTimestamp);
    const ethersPledgeGoal = BigInt(project.projectGoal);

    console.log(unixTimestamp);

    if (this.contract !== undefined) {
        try {
            // Sending the transaction to create the project
            const txResponse = await this.contract["createProject"](
                project.projectTitle,
                project.projectDescription, 
                ethersPledgeGoal,
                unixTimestamp
            );
            console.log("Transaction response:", txResponse);

            // Waiting for the transaction to be mined
            const txReceipt = await txResponse.wait();
            console.log("Transaction receipt:", txReceipt);

            // Parsing the logs to find the ProjectCreated event
            const event = txReceipt.events?.find((event: { event: string; }) => event.event === "ProjectCreated");
            if (event && event.args) {
                const projectId = event.args.projectId;
                console.log("Created project with ID:", projectId);
                return projectId; // Return the project ID
            } else {
                console.error("ProjectCreated event not found in the transaction logs.");
                throw new Error("ProjectCreated event not found");
            }
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error;
        }
    } else {
        console.error("Contract is not initialized.");
    }
  }


    // Function to get the number of projects
    async getProjectCount(): Promise<number> {
      if(this.contract != undefined){
        try {
          const count = await this.contract["projectCount"]();
          console.log("project count is: " + count);
          return count.toNumber(); // Convert bigint to number
      } catch (error) {
          console.error("Error fetching project count:", error);
          throw error;
      }
      }else return 0;
  }

  // Function to get details of a specific project by its ID
  async getProject(projectId: number): Promise<any> {
    if(this.contract != undefined){
      try {
        const project = await this.contract["projects"](projectId);
        console.log("getting project with id: " + project);
        console.log(project);
        return project;
    } catch (error) {
        console.error("Error fetching project details:", error);
        throw error;
      }
    }else return null;
  }

  // Example function to fetch and log all project details
  async fetchAllProjects() {
      try {
          const projectCount = await this.getProjectCount();
          for (let i = 1; i <= projectCount; i++) {
              const project = await this.getProject(i);
              console.log(`Project ${i}:`, project);
          }
      } catch (error) {
          console.error("Error fetching all projects:", error);
      }
  }
}



