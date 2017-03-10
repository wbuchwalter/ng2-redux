import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CounterSelectComponent } from './counter-select.component';
import { NgRedux } from '../../angular-redux/store';
import { NgZone } from '@angular/core';

let defaultReducer = (state, action) => {
  switch (action.type) {
    case 'REPLACE_STATE': return { ...action.payload }
    default: return state;
  }
}
let provideMockRedux = (state, reducer = defaultReducer) => {
  let mockZone = { run: (cb) => cb() }
  let redux = new NgRedux(mockZone as NgZone);
  redux.configureStore(reducer, state);
  return redux;
}

describe('CounterSelectComponent', () => {
  let component: CounterSelectComponent;
  let fixture: ComponentFixture<CounterSelectComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterSelectComponent]
    }).compileComponents()

  }));


  it('should display the initial state value', async(() => {
    provideMockRedux({ counter: 1 });
    const fixture = TestBed.createComponent(CounterSelectComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p')[0].textContent).toContain('counter: 1');
    expect(compiled.querySelectorAll('p')[1].textContent).toContain('counter * 2: 2');
  }));

  it('should reflect updates to the store', async(() => {

    let redux = provideMockRedux({ counter: 1 });
    const fixture = TestBed.createComponent(CounterSelectComponent);
    const compiled = fixture.debugElement.nativeElement;
    
    redux.dispatch({ type: 'REPLACE_STATE', payload: { counter: 10 } });
    fixture.detectChanges();
    expect(compiled.querySelectorAll('p')[0].textContent).toContain('counter: 10');
    expect(compiled.querySelectorAll('p')[1].textContent).toContain('counter * 2: 20');
  }));


});
