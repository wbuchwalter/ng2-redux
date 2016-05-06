import { Injectable } from '@angular/core';

@Injectable()
export class Caps {

  toCaps = (input: string) => input.toUpperCase(); 
}
