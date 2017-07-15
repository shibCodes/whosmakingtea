import { ShibcodesioPage } from './app.po';

describe('shibcodesio App', () => {
  let page: ShibcodesioPage;

  beforeEach(() => {
    page = new ShibcodesioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
