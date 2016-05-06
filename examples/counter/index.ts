import { bootstrap } from '@angular/platform-browser-dynamic';
import { App } from './containers/App';
import { NgRedux } from 'ng2-redux';
import { Caps } from './services/caps.service';
import { CAPS_ACTIONS, CapsActions } from './actions/CapsActions';

bootstrap(App, [ NgRedux, Caps, CAPS_ACTIONS ]);
