import { Component, EventEmitter, Output } from '@angular/core'; 
import { Modal } from 'bootstrap';
import Decimal from 'decimal.js';
import { EthereumService } from 'src/app/services/ethereum.service';

@Component({
  selector: 'app-pledge-modal',
  templateUrl: './pledge-modal.component.html',
  styleUrls: ['./pledge-modal.component.css']
})
export class PledgeModalComponent {
  pledgeAmountFiat!: Decimal;
  etherAmount: string = '';
  weiAmount: string = '';
  @Output() pledgeAmountChanged = new EventEmitter<Decimal>();

  constructor(private ethereumService: EthereumService) {}

  async convertAmount() {
    this.etherAmount = await this.ethereumService.convertToEther(new Decimal(this.pledgeAmountFiat));
    this.weiAmount = (await this.ethereumService.convertToWei(this.pledgeAmountFiat)).toString();
  }

  sendPledge(): void {

    if (!(this.pledgeAmountFiat instanceof Decimal)) {
      this.pledgeAmountFiat = new Decimal(this.pledgeAmountFiat);
    }

    if (this.pledgeAmountFiat !== undefined && this.pledgeAmountFiat.greaterThan(0)) {
      this.pledgeAmountChanged.emit(this.pledgeAmountFiat);
    }
  }

  closeModal(): void {
    const closeButton = document.querySelector('.btn-close[data-bs-dismiss="modal"]') as HTMLElement;
    if (closeButton) {
      closeButton.click(); // Simulate a click on the close button
    } else {
      console.error('Close button not found!');
    }
  }
  

  getWei(){
    return this.weiAmount;
  }
}
