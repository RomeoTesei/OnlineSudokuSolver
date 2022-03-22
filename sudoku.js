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

    let grid = await page.$$("#y6 > div > div > div")

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

    let solved = false

    // while (!solved) {
    // for (let j = 0; j < 100; j++) {
    //     console.log("-------------------------------------------------------------------------------------------------");
    //     for (let i = 0; i < 9; i++) {
    //         complete(lines[i], "Ligne", i, page)
    //         complete(columns[i], "Colonne", i, page)
    //         complete(squares[i], "Squares", i, page)
    //     }
    // }

    // for (let boucle = 0; boucle < 10; boucle++) {
    //     for (let i = 1; i <= 9; i++) {
    //         let squaresToCheck = getSquaresWithout(i)
    //         for (let currentSquareI of squaresToCheck) {
    //             console.log(i, squares[currentSquareI]);
    //         }
    //     }

    // }




    solved = isSolved(squares)
        // }

    // Check if one left in each square (done)
    // Check if one left in each row and column (done)
    // For each number, check where the placement is obvious
    // Repeat until complete

    completeIfObvious(4)

    showGrid(allCells);

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
    let cell = await page.$("#vc_" + cellX + "_" + cellY)
    await cell.click()
    sleep(500)
    await page.keyboard.press(number)
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

function completeIfObvious(currentSquareIndex) {
    let contenu = squares[currentSquareIndex].flat()

    let possible = {}

    for (let i = 0; i < contenu.length; i++) {
        possible[i] = []
        let rowOfSquare = Math.floor(currentSquareIndex / 3)
        let colOfSquare = currentSquareIndex % 3
        let cellX = colOfSquare + (i % 3) + (colOfSquare * 2)
        let cellY = rowOfSquare + Math.floor(i / 3) + (rowOfSquare * 2)

        let currentCol = getColumn(cellX)
        let currentLine = getLine(cellY)



        if (!(currentCol.includes(i.toString()) || currentLine.includes(i.toString()))) {
            possible[i].push(i)
        }

        console.log(i + "---------------------------");
        console.log("col", currentCol);
        console.log("line", currentLine);
        console.log("----------------------------");
        console.log();

    }


    console.log("Possible ---------------------------");
    console.log("possible", possible);
    console.log("------------------------------------");



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
        let rowOfSquare = Math.floor(zoneIndex / 3)
        let colOfSquare = zoneIndex % 3
        let cellX = colOfSquare + (index % 3) + (colOfSquare * 2)
        let cellY = rowOfSquare + Math.floor(index / 3) + (rowOfSquare * 2)


        await addNumber(toAdd[0], cellX, cellY, page)
    }

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