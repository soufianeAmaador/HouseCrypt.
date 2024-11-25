import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/models/update';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit{
  @Input() update!: Update;

  constructor(){}

  ngOnInit(): void {
    
    
  }


}
