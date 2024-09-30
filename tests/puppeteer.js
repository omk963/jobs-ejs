const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword, factory } = require("../util/seed_db");
const Job = require("../models/Job");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("jobs-ejs puppeteer test", function () {
    before(async function () {
        this.timeout(10000);
        //await sleeper(5000)
        // browser = await puppeteer.launch({ headless: false, slowMo: 100 })
        browser = await puppeteer.launch()
        page = await browser.newPage();
        await page.goto("http://localhost:3000");
    });
    after(async function () {
        this.timeout(5000);
        await browser.close();
    });
    describe("got to site", function () {
        it("should have completed a connection", async function () { });
    });
    describe("index page test", function () {
        this.timeout(10000);
        it("finds the index page logon link", async () => {
            this.logonLink = await page.waitForSelector(
                "a ::-p-text(Click this link to logon)",
            );
        });
        it("gets to the logon page", async () => {
            await this.logonLink.click();
            await page.waitForNavigation();
            const email = await page.waitForSelector('input[name="email"]');
        });
    });
    describe("logon page test", function () {
        this.timeout(20000);
        it("resolves all the fields", async () => {
            this.email = await page.waitForSelector('input[name="email"]');
            this.password = await page.waitForSelector('input[name="password"]');
            this.submit = await page.waitForSelector("button ::-p-text(Logon)");
        });
        it("sends the logon", async () => {
            testUser = await seed_db();
            await this.email.type(testUser.email);
            await this.password.type(testUserPassword);
            await this.submit.click();
            await page.waitForNavigation();
            await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
            await page.waitForSelector("a ::-p-text(change the secret)");
            await page.waitForSelector('a[href="/secretWord"]');
            const copyr = await page.waitForSelector("p ::-p-text(copyright)");
            const copyrText = await copyr.evaluate((el) => el.textContent);
            console.log("copyright text: ", copyrText);
        });
    });
    describe("puppeteer job operations", function () {
        it("finds the job listings link", async () => {
            this.jobLink = await page.waitForSelector(
                "a ::-p-text(Click this link to view/change your jobs)",
            );
        });
        it("gets to the job listings page", async () => {
            await this.jobLink.click();
            await page.waitForNavigation();
            const jobs = await page.content();
            const numJobs = jobs.split("<tr>").length - 1; // Subtract 1 to account for the table header
            // confirm there are 20 entries in the list
            if (numJobs === 20) {
                console.log('Test Passed: There are 20 entries in the job list');
            }
        });
        it('finds the job add button', async () => {
            this.jobAddLink = await page.waitForSelector(
                "a ::-p-text(Add Job)",
            );
        });
        it("gets to the job adding form page", async () => {
            await this.jobAddLink.click();
            await page.waitForNavigation();
            const company = await page.waitForSelector('input[name="company"]');
        });
        it("resolves all the fields", async () => {
            this.company = await page.waitForSelector('input[name="company"]');
            this.position = await page.waitForSelector('input[name="position"]');
            this.status = await page.waitForSelector('select[name="status"]');
            this.submit = await page.waitForSelector("button ::-p-text(Add)");
        });
        this.timeout(20000);
        it("sends the job", async () => {
            testJob = await factory.build('job');
            await this.company.type(testJob.company);
            await this.position.type(testJob.position);
            await this.status.select(testJob.status);
            await this.submit.click();
            await page.waitForNavigation();
            await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
            console.log("Waiting for confirmation message...");
            const sucMsg = await page.waitForSelector("div ::-p-text(job was added)");
            // const sucMsg = await page.waitForSelector("div.success-message");
            const sucMsgText = await sucMsg.evaluate((el) => el.textContent);
            console.log("Success text: ", sucMsgText);
        });
    });
});