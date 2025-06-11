// EndToEnd.test.js

import puppeteer from "puppeteer";

describe("Meet App End-to-End Features", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:5173/");
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  describe("Show/Hide an event details", () => {
    test("An event element is collapsed by default", async () => {
      await page.waitForSelector(".event");
      const details = await page.$(".event .details");
      expect(details).toBeNull();
    }, 15000);

    test("User can expand event to see details", async () => {
      await page.waitForSelector(".event button");
      await page.click(".event button");
      await page.waitForSelector(".event .details");
      const details = await page.$(".event .details");
      expect(details).not.toBeNull();
    }, 15000);

    test("User can collapse event to hide details", async () => {
      await page.waitForSelector(".event button");
      await page.click(".event button");
      const details = await page.$(".event .details");
      expect(details).toBeNull();
    }, 15000);
  });

  describe("Specify number of events", () => {
    test("User can change the number of events displayed", async () => {
      await page.waitForSelector("#number-of-events");
      await page.click("#number-of-events", { clickCount: 3 });
      await page.type("#number-of-events", "2");
      await page.waitForFunction(() => {
        return document.querySelectorAll("#event-list .event").length === 2;
      });
      const events = await page.$$("#event-list .event");
      expect(events).toHaveLength(2);
    }, 20000);
  });
});
