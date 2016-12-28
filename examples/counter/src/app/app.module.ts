import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgReduxModule, DevToolsExtension } from 'ng2-redux';
import { CounterActions } from '../actions/counter.actions';
import { SearchActions } from '../actions/search.actions';
import { AppComponent } from './app.component';
import { CounterInfoComponent } from '../components/counter-info.component';
import { CounterComponent } from '../components/counter.component';
import { SearchComponent } from '../components/search.component';
import { RandomNumberService } from '../services/random-number.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NgReduxModule,
  ],
  declarations: [
    AppComponent,
    CounterInfoComponent,
    CounterComponent,
    SearchComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    CounterActions,
    SearchActions,
    RandomNumberService,
  ]
})
export class AppModule {}
