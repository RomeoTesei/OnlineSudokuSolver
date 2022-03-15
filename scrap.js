const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://soduko-online.com/');
    sleep(1000)

    let grid = await page.$$("#y6 > div")

    let cases = []

    grid.forEach(carre => {
        currentZone = []
        for (let caze of carre) {
            currentZone.push(page.evaluate(el => el.textContent, caze[0]))
        }
        cases.push(currentZone)
    })
    console.log(cases);




})()

/**
 * Ajoute une methode sleep a JS 
 * 
 * @param milliseconds la duree d'attente
 */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}