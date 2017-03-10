import { Component } from '@angular/core';
import { select } from '../angular-redux/store';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  @select('counter') counter$;

  /*constructor(private ngRedux: NgRedux<any>) {

  }

  increase() {
    this.ngRedux.dispatch({ type: 'INCREASE' });
  }

  decrease() {
    this.ngRedux.dispatch({ type: 'DECREASE' });
  }*/
}
