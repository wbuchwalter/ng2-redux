import { BehaviorSubject } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { select } from '../../angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-counter-select',
  templateUrl: './counter-select.component.html',
  styleUrls: ['./counter-select.component.css']
})
export class CounterSelectComponent implements OnInit {
  @select() counter$
  counterx2$ = this.counter$.map(n => n * 2);

  constructor() { }

  ngOnInit() {

  }

}
