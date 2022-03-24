import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // todos: Todo[] = [];
  public hello: string[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // this.apiService.getTodos().subscribe(todos => {
    //   this.todos = todos;
    // });

    this.apiService.getHello().subscribe(data => {
      this.hello = data;
    })
  }

  // removeTodos(): void {
  //   this.todos = [];
  // }

}
