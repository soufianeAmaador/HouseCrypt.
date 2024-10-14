import { Component, EventEmitter, Output } from '@angular/core'; 
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
    this.weiAmount = this.ethereumService.convertToWei(this.pledgeAmountFiat).toString();
  }

  sendPledge(): void {
    if(this.pledgeAmountFiat !== undefined && this.pledgeAmountFiat.greaterThan(0))
    this.pledgeAmountChanged.emit(this.pledgeAmountFiat);
  }

  getWei(){
    return this.weiAmount;
  }

  closeModal() {

  }
}
