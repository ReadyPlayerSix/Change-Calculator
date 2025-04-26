const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const axios = require('axios');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.listen(8888);

const url = 'http://localhost:8888/index.html';


describe('Change Calculator', function () {
  this.timeout(10000);
  this.slow(5000);
  
  it('should load successfully', () => axios.get(url).then(r => expect(r.status === 200)));

  describe('HTML', () => {
    let browser;
    let page;

    before(async() => {
      browser = await puppeteer.launch({ headless: "new"});
      page = await browser.newPage();
      await page.goto(url);
    });

    after(async () => {
      await browser.close();
    });

    it('should have a H1 with the text "Change Calculator"', async () => {
      const heading = await page.$eval('h1', el => el.innerText);
      expect(heading).to.equal('Change Calculator');
    });

    it('should have an input element with an id of "amount-due"', async () => {
      const input = await page.$('#amount-due');
      expect(input).to.not.be.null;
    });

    it('should have an input element with an id of "amount-received"', async () => {
      const input = await page.$('#amount-received');
      expect(input).to.not.be.null;
    });

    it('should contain a button with an id of "calculate-change"', async () => {
      const button = await page.$('#calculate-change');
      expect(button).to.not.be.null;
    });

    for (const id of [
      'dollars-output',
      'quarters-output',
      'dimes-output',
      'nickels-output',
      'pennies-output'
    ]) {
      it(`should contain a paragraph element with an id of "${id}"`, async () => {
        const element = await page.$(`#${id}`);
        expect(element).to.not.be.null;
      });
    }
  });

  describe('Integration', () => {
    let browser;
    let page;

    beforeEach(async () => {
      browser = await puppeteer.launch({ headless: "new" });
      page = await browser.newPage();
    });

    afterEach(async () => {
      await browser.close();
    });

    it(`should display correct change`, async () => {
      await page.goto(url);
      await page.type('#amount-received', '20');
      await page.type('#amount-due', '10.21');
      await page.click('#calculate-change');

      // Wait for the elements to be available
      await page.waitForSelector('#dollars-output');

      const change = await page.evaluate(() => ({
        dollars: document.querySelector('#dollars-output').innerText,
        quarters: document.querySelector('#quarters-output').innerText,
        dimes: document.querySelector('#dimes-output').innerText,
        nickels: document.querySelector('#nickels-output').innerText,
        pennies: document.querySelector('#pennies-output').innerText,
      }));

      expect(change.dollars).to.equal('9', 'Expected dollars didn\'t match');
      expect(change.quarters).to.equal('3', 'Expected quarters didn\'t match');
      expect(change.dimes).to.equal('0', 'Expected dimes didn\'t match');
      expect(change.nickels).to.equal('0', 'Expected nickels didn\'t match');
      expect(change.pennies).to.equal('4', 'Expected pennies didn\'t match');
    });

    it(`should display correct change`, async () => {
      await page.goto(url);
      await page.type('#amount-received', '20');
      await page.type('#amount-due', '13.34');
      await page.click('#calculate-change');
      
      // Wait for the elements to be available
      await page.waitForSelector('#dollars-output');
      
      const change = await page.evaluate(() => ({
        dollars: document.querySelector('#dollars-output').innerText,
        quarters: document.querySelector('#quarters-output').innerText,
        dimes: document.querySelector('#dimes-output').innerText,
        nickels: document.querySelector('#nickels-output').innerText,
        pennies: document.querySelector('#pennies-output').innerText,
      }));
      
      expect(change.dollars).to.equal('6', 'Expected dollars didn\'t match');
      expect(change.quarters).to.equal('2', 'Expected quarters didn\'t match');
      expect(change.dimes).to.equal('1', 'Expected dimes didn\'t match');
      expect(change.nickels).to.equal('1', 'Expected nickels didn\'t match');
      expect(change.pennies).to.equal('1', 'Expected pennies didn\'t match');
    });
  });
});
