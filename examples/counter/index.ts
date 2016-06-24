import { bootstrap } from '@angular/platform-browser-dynamic';
import { App } from './containers/App';
import { NgRedux } from 'ng2-redux';
import { RandomNumberService } from './services/random-number';
bootstrap(App, [ NgRedux, RandomNumberService ]);
