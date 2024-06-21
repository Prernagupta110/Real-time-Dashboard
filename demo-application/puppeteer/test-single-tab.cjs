const puppeteer = require("puppeteer");

(async () => {
    const tests = 5;
    const reloads = 10;
    let average = 0;
    for (let j = 0; j < tests; j++) {
        const browser = await puppeteer.launch({
            headless: "new",
        });
        for (let i = 0; i < reloads; i++) {
            const context = await browser.createIncognitoBrowserContext();
            const page = await context.newPage();
            await page.setCacheEnabled(false);

            const start = performance.now();
            await page.goto("http://localhost:5173/");
            await page.waitForXPath('//h1[contains(text(), "Dashboard")]');
            await page.waitForXPath('//p[contains(text(), "Loading")]', { hidden: true });
            const end = performance.now();
            average += end - start;

        }
        await browser.close();
    }

    average /= tests * reloads;
    console.log("Average loading time: %f milliseconds", average);
})();
