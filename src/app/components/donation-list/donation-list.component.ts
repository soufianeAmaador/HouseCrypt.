import { Component, Input } from '@angular/core';
import { ethers } from 'ethers';
import { Donation } from 'src/app/models/Donation';
import { EthereumService } from 'src/app/services/ethereum.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent {
  @Input() donations: Donation[] = [];

  sortedDonations: Donation[] = [];
  currencyValuesMap: Map<string, CurrencyValues[]> = new Map(); // Map for projectId and CurrencyValues

  constructor(private ethereumService: EthereumService) { }

  ngOnInit(): void {
    this.sortedDonations = 
    this.donations.sort((a, b) => b.time.getTime() - a.time.getTime());

    // Iterate over donations and process currency values asynchronously
    this.donations.forEach(async (donation: Donation) => {
      try {
        const pledgedEther = ethers.utils.formatUnits(donation.amount, "ether");
        const pledgedDollar = await this.ethereumService.convertToDollars(BigInt(donation.amount));

        const currencyValues: CurrencyValues = {
          pledgedWei: donation.amount.toString(),
          pledgedEther: pledgedEther,
          pledgedDollar: pledgedDollar
        };

        // Ensure the map has the project ID key, then add the values
        if (!this.currencyValuesMap.has(donation.id!)) {
          this.currencyValuesMap.set(donation.id!, []);
        }

        this.currencyValuesMap.get(donation.id!)?.push(currencyValues);
      } catch (error) {
        console.error(`Error processing donation for ID ${donation.id}:`, error);
      }
    });
  }
}

interface CurrencyValues {
  pledgedWei: string;
  pledgedEther: string;
  pledgedDollar: string;
}
