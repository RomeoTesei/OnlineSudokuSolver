const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://www.websudoku.com/');
    sleep(1000)

    let grid = await page.$$('#puzzle_grid > tbody > tr')

    let myBoard = []

    console.log(grid);

    // grid[0].forEach(row => {
    //     console.log(row);
    //     myBoard.push(row)
    // })

    console.log(myBoard);





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