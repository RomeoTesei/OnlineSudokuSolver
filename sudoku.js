let lines = []
let columns = []
let squares = []
let allCells = []

const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://soduko-online.com/');

    await setGrid(page)

    while (!isSolved()) {
        await setGrid(page)
        for (let i = 0; i < 9; i++) {
            await completeIfObvious(i, page)
        }
        showGrid(allCells)
    }
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
 * It gets the grid from the page.
 * @param page - the page to run the script on
 */
async function setGrid(page) {
    let grid = await page.$$("#y6 > div > div > div")

    lines = []
    columns = []
    squares = []
    allCells = []

    let values = []

    for (let value of grid) {
        values.push(await page.evaluate(val => val.textContent, value))
    }

    let newValues = [];
    while (values.length) newValues.push(values.splice(0, 3));

    while (newValues.length) allCells.push(newValues.splice(0, 3));


    for (let i = 0; i < 9; i++) {
        lines.push(getLine(i))
        columns.push(getColumn(i))
        squares.push(getSquare(i))
    }
}

function isSolved() {
    solved = true
    for (let square of squares) {
        solved = getMissingNumbers(square) == []
    }
    return solved
}

/**
 * Given a number, return the indices of the squares that do not contain that number
 * @param number - The number to check for.
 * @returns An array of the squares that do not contain the number.
 */
function getSquaresWithout(number) {
    let result = []
    for (let i = 0; i < squares.length; i++) {
        zone = squares[i].flat()
        if (!zone.includes(number.toString())) {
            result.push(i)
        }
    }
    return result
}

/**
 * It adds a number to a cell on the sudoku board.
 * @param number - The number to be added to the cell.
 * @param cellX - The x coordinate of the cell.
 * @param cellY - The y coordinate of the cell.
 * @param page - the page object
 * @returns Nothing.
 */
async function addNumber(number, cellX, cellY, page) {
    if (number <= 0 || number > 9) {
        return null
    }
    await page.click("#vc_" + cellX + "_" + cellY, { button: "left" })
    await page.keyboard.press(number)
    sleep(1000)
}

/**
 * Given a list of numbers, return a list of numbers that are not in the list
 * @param current - the current state of the board
 * @returns The missing numbers in the zone.
 */
function getMissingNumbers(current) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let numbersInZone = []

    for (let subCurrent of current) {
        for (let val of subCurrent) {
            if (val != ' ') {
                numbersInZone.push(parseInt(val))
            }
        }
    }
    return numbers.filter(x => !numbersInZone.includes(x));
}

/**
 * Given a square, return a dictionary of possible values for each cell in the square
 * @param currentSquareIndex - the index of the square we're currently working on
 * @returns A dictionary with the index of the square as key and a list of possible numbers as value.
 */
function getPossibles(currentSquareIndex) {
    let contenu = squares[currentSquareIndex].flat()

    let possible = {}

    for (let i = 0; i < contenu.length; i++) {
        possible[i] = []
        if (contenu[i] == ' ') {

            let co = getCoWithIndices(currentSquareIndex, i)

            let currentCol = getColumn(co[0])
            let currentLine = getLine(co[1])

            for (let j = 1; j <= 9; j++) {
                if (!(currentCol.flat().includes(j.toString())) && !(currentLine.flat().includes(j.toString())) && !(contenu.includes(j.toString()))) {
                    possible[i].push(j)
                }
            }
        }
    }
    return possible
}

async function completeIfObvious(currentSquareIndex, page) {
    let possibles = getPossibles(currentSquareIndex)
    let interessants = {}
    let occurences = {}
    for (let key in possibles) {
        if (possibles[key].length) {

            for (let val of possibles[key]) {

                if (Object.keys(occurences).includes(val.toString())) {
                    occurences[val]++
                } else {
                    occurences[val] = 1
                }
            }


            interessants[key] = possibles[key]
        }
    }

    console.log("interessants ", interessants);

    for (let key of Object.keys(interessants)) {
        if (interessants[key].length == 1) {
            let co = getCoWithIndices(currentSquareIndex, key)
            await addNumber(interessants[key][0], co[0], co[1], page)
        }
    }


    console.log("occurences ", occurences);

    for (let key of Object.keys(occurences)) {
        if (occurences[key] == 1) {
            for (let keyI of Object.keys(interessants)) {
                if (interessants[keyI].includes(parseInt(key))) {

                    let co = getCoWithIndices(currentSquareIndex, keyI)

                    await addNumber(key, co[0], co[1], page)

                }
            }
        }
    }
}

async function completeIfOneLeft(zone, zoneType, zoneIndex, page) {
    let toAdd = getMissingNumbers(zone)
    console.log("----> " + toAdd.length + " " + zoneType);
    if (toAdd.length != 1) {
        return null
    }
    zone = zone.flat()
    index = -1
    for (let i = 0; i < zone.length; i++) {
        if (zone[i] == ' ') {
            index = i
        }
    }

    if (zoneType == "Colonne") {
        await addNumber(toAdd[0], zoneIndex, index, page)
    } else if (zoneType == "Ligne") {
        await addNumber(toAdd[0], index, zoneIndex, page)
    } else {
        let co = getCoWithIndices(zoneIndex, index)

        await addNumber(toAdd[0], co[0], co[1], page)
    }

}

/**
 * Given a zone index and a cell index, return the x and y coordinates of the cell
 * @param zoneIndex - The index of the zone (0-8)
 * @param cellIndex - The index of the cell in the zone.
 * @returns The coordinates of the cell in the grid.
 */
function getCoWithIndices(zoneIndex, cellIndex) {

    let rowOfSquare = Math.floor(zoneIndex / 3)
    let colOfSquare = zoneIndex % 3
    let cellX = colOfSquare + (cellIndex % 3) + (colOfSquare * 2)
    let cellY = rowOfSquare + Math.floor(cellIndex / 3) + (rowOfSquare * 2)

    return [cellX, cellY]
}

/**
 * Given a list of cells, return a list of the cells in the same line
 * @param cells - the array of cells
 * @param number - The number of the line you want to get.
 * @returns A list of the cells in the line.
 */
function getLine(number) {

    if (number < 0 || number > 8) {
        return null
    }

    let line = []
    let startLine = Math.floor(number / 3) * 3

    for (let i = startLine; i < startLine + 3; i++) {
        line.push(allCells[i][number % 3])
    }
    return line
}

/**
 * Given a list of cells, return a list of the cells in the same column as the given cell
 * @param cells - The array of arrays that contains the cells.
 * @param number - The number of the column you want to get.
 * @returns a list of lists. Each list is a column of the sudoku.
 */
function getColumn(number) {
    if (number < 0 || number > 8) {
        return null
    }
    let column = []

    let startColumn = Math.floor(number / 3)

    for (let i = startColumn; i <= startColumn + 6; i += 3) {
        current = []
        for (let j = 0; j < 3; j++) {
            current.push(allCells[i][j][number % 3])
        }
        column.push(current)
    }
    return column
}

/**
 * Return the square at the given index
 * @param cells - an array of 9 cells
 * @param number - The number of the square you want to get.
 * @returns the square
 */
function getSquare(number) {
    if (number < 0 || number > 8) {
        return null
    }
    return allCells[number]
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