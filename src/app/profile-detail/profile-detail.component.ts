import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  editPressed = false;

  constructor() { }

  ngOnInit(): void {
  }

  saveFormData(form: NgForm){
    this.editPressed = false;
  }

  onEditPressed(){
    this.editPressed = true;
  }

  connectWallet(){

  }

}
