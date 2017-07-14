import { WhosmakingteaPage } from './app.po';

describe('whosmakingtea App', () => {
  let page: WhosmakingteaPage;

  beforeEach(() => {
    page = new WhosmakingteaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
