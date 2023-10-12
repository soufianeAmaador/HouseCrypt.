import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  index = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onTabClicked(index: number){
    this.index = index;
  }

}
