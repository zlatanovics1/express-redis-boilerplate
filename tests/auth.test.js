const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();

  await page.goto("localhost:3000");
});

test("Expect header to be rendered", async () => {
  const headerText = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(headerText).toEqual("Blogster");
});

afterEach(() => {
  //   await page.close();
});

test("Expect google auth is opened", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test("Expect signout button render on auth complete", async () => {
  await page.login();

  const signoutButton = await page.$eval(
    'a[href="/auth/logout"]',
    (el) => el.innerHTML
  );

  expect(signoutButton).toEqual("Logout");
});
