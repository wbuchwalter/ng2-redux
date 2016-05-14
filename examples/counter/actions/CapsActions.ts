import { provide, OpaqueToken } from '@angular/core';
import { Caps } from '../services/caps.service';
export abstract class CapsActions {
  abstract makeUpper(input: string): any;
}

let capsFactory = (caps: Caps) => {

  return {
    makeUpper: (input:string) => {
      
      return {
        type: 'MAKE_UPPER',
        payload: caps.toCaps(input)
      };
    }
   }  
};

export const CAPS_ACTIONS = provide(CapsActions, {
  useFactory: capsFactory,
  deps: [Caps]

});

