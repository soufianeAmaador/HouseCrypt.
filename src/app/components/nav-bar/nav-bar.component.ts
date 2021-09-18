import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isCollapsed = "collapse" ;
  addPadding = "ps-5";

  constructor() { }

  ngOnInit(): void {
  }

  toggleNavBar() {
    console.log("toggle nav bar clicked!");
    this.isCollapsed = (this.isCollapsed === "collapse") ? "collapse.show" : "collapse"; 
    this.addPadding = (this.addPadding === "ps-5") ? "" : "ps-5";
  }

}
