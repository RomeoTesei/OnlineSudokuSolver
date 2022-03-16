const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://soduko-online.com/');

    let grid = await page.$$("#y6 > div > div > div")

    let values = []

    for (let value of grid) {
        values.push(await page.evaluate(val => val.textContent, value))
    }

    let newValues = [];
    while (values.length) newValues.push(values.splice(0, 3));

    let newNewValues = []
    while (newValues.length) newNewValues.push(newValues.splice(0, 3));

    console.log(newNewValues)

    getLine(newNewValues, 4)
    getColumn(newNewValues, 5)

    showGrid(newNewValues);


})()

/**
 * It waits for a certain amount of time.
 * @param milliseconds - The number of milliseconds to wait.
 */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


/**
 * Get a line of the grid
 * @param cells - the grid
 * @param number - The height of the line (0-8)
 * @returns The line of cells (array) or null if heigt value is not valid
 */
function getLine(cells, number) {

    if (number < 0 || number > 8) {
        return null
    }

    let line = []
    let startLine = Math.floor(number / 3) * 3

    for (let i = startLine; i < startLine + 3; i++) {
        line.push(cells[i][number % 3])
    }
    return line
}

function getColumn(cells, number) {
    if (number < 0 || number > 8) {
        return null
    }

    let startColumn = Math.floor(number / 3)

    for (let i = 0; i < 9; i++) {
        console.log(Math.floor(i / 3) + i % 3 * 3);
    }

    let column = []

    // number = 0,1,2 --> 0, 3, 6
    // number = 3,4,5 --> 1, 4, 7
    // number = 6,7,8 --> 2, 5, 8 
}


/**
 * Prints out the grid in a nice format
 * @param grid - the grid to be displayed
 */
function showGrid(grid) {
    console.log("+-----------------------------+");
    for (let h = 0; h < 3; h++) {
        for (let i = 0; i < 3; i++) {
            let line = "|"
            for (let j = 0; j < 3; j++) {
                line += " " + grid[j + 3 * h][i][0] + "  " + grid[j + 3 * h][i][1] + "  " + grid[j + 3 * h][i][2] + " |"
            }

            console.log(line)

        }
        if (h != 2) {
            console.log("|-----------------------------|");
        }

    }

    console.log("+-----------------------------+");
}