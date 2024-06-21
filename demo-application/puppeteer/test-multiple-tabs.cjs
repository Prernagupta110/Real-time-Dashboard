const puppeteer = require("puppeteer");

(async () => {
    const tests = 5;
    const tabs = 10;
    let average = 0;
    for (let j = 0; j < tests; j++) {
        const browser = await puppeteer.launch({
            headless: "new"
        });
        let page = await browser.newPage();
        await page.setCacheEnabled(false);
        for (let i = 0; i < tabs; i++) {
            const start = performance.now();
            await page.goto("http://localhost:5173/");
            await page.waitForXPath('//h1[contains(text(), "Dashboard")]');
            await page.waitForXPath('//p[contains(text(), "Loading")]', { hidden: true });
            const end = performance.now();
            average += end - start;
            page = await browser.newPage();
            await page.setCacheEnabled(false);
        }
        await browser.close();
    }

    average /= tests * tabs;
    console.log("Average loading time: %f milliseconds", average);
})();
