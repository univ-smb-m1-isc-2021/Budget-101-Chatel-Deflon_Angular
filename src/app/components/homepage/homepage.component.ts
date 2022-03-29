import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // todos: Todo[] = [];
  public hello: string[] = [];
  options: FormGroup;
  typeValue = new FormControl(false);
  freqValue = new FormControl('auto');
  selectFormControl = new FormControl('');

  constructor(
    private apiService: ApiService,
    fb: FormBuilder
  ) {
    this.options = fb.group({
      typeValue: this.typeValue,
      freqValue: this.freqValue,
    });
  }

  ngOnInit(): void {
    // this.apiService.getTodos().subscribe(todos => {
    //   this.todos = todos;
    // });

    this.apiService.getHello().subscribe(data => {
      this.hello = data;
    })
  }

  Submit() {
    console.log("test submit");
  }

  // removeTodos(): void {
  //   this.todos = [];
  // }

}
