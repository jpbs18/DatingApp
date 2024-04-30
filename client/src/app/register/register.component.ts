import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegisterModel } from '../interfaces/account/RegisterModel';
import { User } from '../interfaces/account/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  @Input() users: User[] = [];
  @Output() cancelRegister = new EventEmitter();

  model: RegisterModel = {
    username: "",
    password: ""
  };

  constructor(){

  }
  
  ngOnInit(): void {
    
  }

  register(){
    console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
