import { NgZone, Component, Injectable } from '@angular/core';
import 'rxjs/add/operator/take';

import { SubStore } from './sub-store';
import { select, select$ } from './select';
import { dispatch } from './dispatch';
import { PathSelector } from '../components/selectors';
import { NgRedux } from '../components/ng-redux';

class MockNgZone { run = fn => fn() }

describe('@SubStore', () => {
  let ngRedux;
  const localReducer = (state, action) => state;
  const basePathMethodName = 'getSubStorePath';

  beforeEach(() => {
    const defaultState = {
      a: {
        b: { foo: 'Foo!' }
      }
    };

    ngRedux = new NgRedux(new MockNgZone() as NgZone);
    NgRedux.instance = ngRedux;
    ngRedux.configureStore(
      (state, action) => state,
      defaultState);
  });

  describe('Adding @SubStore to the class causes @select to', () => {
    it('use a substore for inferred-name selections', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select() foo;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for inferred-name selections with $ on the end', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select() foo$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a property selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select('foo') obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a function selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select(s => s.foo) obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a path selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select(['b', 'foo']) obs$;
        getSubStorePath = (): PathSelector => [ 'a' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a property selector with a comparator', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select('foo', (x, y) => x !== y) obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });
  });

  describe('Adding @SubStore to the class causes @select$ to', () => {
    it('use a substore for a property selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select$('foo', o$ => o$.map(x => x)) obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a function selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select$(s => s.foo, o$ => o$.map(x => x)) obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a path selector', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select$(['b', 'foo'], o$ => o$.map(x => x)) obs$;
        getSubStorePath = (): PathSelector => [ 'a' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('use a substore for a property selector with a comparator', () => {
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select$(
          'foo',
          o$ => o$.map(x => x),
          (x, y) => x !== y) obs$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.obs$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });
  });

  describe('Adding @SubStore to the class causes @dispatch to', () => {
    it('scope dispatches to substore', () => {
      spyOn(NgRedux.instance, 'dispatch');

      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @dispatch() createFooAction = () => ({ type: 'FOO' });
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      new TestClass().createFooAction();
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: 'FOO',
        '@angular-redux::fractalkey': JSON.stringify([ 'a', 'b' ]),
      });
    });
  });

  describe('@SubStore coexists with', () => {
    it('@Component', () => {
      @Component({ template: '<p>Wat</p>' })
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select() foo$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('@Component the other way round', () => {
      @SubStore({ basePathMethodName, localReducer })
      @Component({ template: '<p>Wat</p>' })
      class TestClass {
        @select() foo$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('@Injectable', () => {
      @Injectable()
      @SubStore({ basePathMethodName, localReducer })
      class TestClass {
        @select() foo$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });

    it('@Injectable in the other order', () => {
      @SubStore({ basePathMethodName, localReducer })
      @Injectable()
      class TestClass {
        @select() foo$;
        getSubStorePath = (): PathSelector => [ 'a', 'b' ];
      };

      const testInstance = new TestClass();
      testInstance.foo$
        .take(1)
        .subscribe(v => expect(v).toEqual('Foo!'));
    });
  });
});
