import { CounterPage } from './app.po';

describe('counter App', function() {
  let page: CounterPage;

  beforeEach(() => {
    page = new CounterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
