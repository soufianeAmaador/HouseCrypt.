import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PropertyService } from 'src/app/services/property-service.service';
import { Bidder } from 'src/app/models/Bidder';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  property!: Property;
  propertyId!: string;
  isLargestBid: Boolean = false;


  amount = new FormControl('');
  formGroup = this.formBuilder.group(
    this.amount
  );

  constructor(private propertyService: PropertyService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) {
              
               }

  ngOnInit(): void {
    //First get the id of all the property so we can load all the bullshit data and biddings!
    this.activatedRoute.queryParams.subscribe(
      (params: Params) =>{
        this.propertyId = params.id;
        this.property = this.propertyService.getAllProperties().get(this.propertyId)!;
        this.property.biddings.sort(sortBiddingsDescending);
        
      }
    )
  }

  onSubmit(): void{
    if(parseInt(this.amount.value) > this.property.biddings[0].amount){
      this.property.biddings.unshift(new Bidder("Anon",this.amount.value,"0x000000"));
      this.amount.setValue("");
    }

  }

  //Formvalidations 
  emitChange(): void{
    if(this.amount.value === "" || this.amount.value <= this.property.biddings[0].amount) this.isLargestBid = false;
    else this.isLargestBid = true;
     
  }

}

// Simple anonymous function to sort the biddings
const sortBiddingsDescending = (bid1: Bidder, bid2:Bidder) => {
  let price1 = bid1.amount;
  let price2 = bid2.amount;

  if(bid1> bid2){
    return 1;
  }
  if(bid1 < bid2){
    return -1;
  }
  return 0;
}