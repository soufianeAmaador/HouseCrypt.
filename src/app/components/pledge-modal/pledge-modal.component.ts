import { Component, EventEmitter, Output } from '@angular/core'; 

@Component({
  selector: 'app-pledge-modal',
  templateUrl: './pledge-modal.component.html',
  styleUrls: ['./pledge-modal.component.css']
})
export class PledgeModalComponent {
  pledgeAmount!: number;
  @Output() pledgeAmountChanged = new EventEmitter<number>();
  

  constructor() {
   }

  sendPledge(): void {
    if(this.pledgeAmount !== undefined && this.pledgeAmount > 0)
    this.pledgeAmountChanged.emit(this.pledgeAmount);
  }

  closeModal() {

  }
}
