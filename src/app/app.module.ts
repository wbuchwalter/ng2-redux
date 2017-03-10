import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NgReduxModule, NgRedux } from '../angular-redux/store';
import { combineReducers } from 'redux';
import { CounterSelectComponent } from './counter-select/counter-select.component';
@NgModule({
  declarations: [
    AppComponent,
    CounterSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgReduxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<any>) {
    let counter = (state = 1, action) => {
      switch (action.type) {
        case 'INCREASE': return state + 1;
        case 'DECREASE': return state - 1;
        default: return state;
      }
    };

    let rootReducer = combineReducers({ counter });
    ngRedux.configureStore(rootReducer, {}, [], [])
  }
}
