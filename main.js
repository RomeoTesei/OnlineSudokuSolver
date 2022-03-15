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

    await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q")
    sleep(500)
        // await page.click('#tile32')

    let myBoard = []

    // sleep(100)
    let board = await page.$$('#board img')
    let i = 0
    let rowNb = 0
    let row = []
    while (true) {

        // Get the urls of all the images
        for (const el of board) {
            // let img = await el.$('img'); //Get the link to the product page
            let url = await page.evaluate(li => li.getAttribute('src'), el) //get the url for the full res img (url stored in the attribute 'data-old-hires') 
                // console.log(url);

            row[i] = get_tile_type(url)

            i++
            if (i == 9) {
                myBoard = [...myBoard, row];
                i = 0
                row = []
            }
        }


        let tiles = get_tiles(myBoard)
            // console.log(tiles);
        let click = check_tiles(myBoard, tiles)
        console.log("left : ", click[0]);
        console.log("right : ", click[1]);

        myBoard.forEach(row => {
            console.log(JSON.stringify(row));
        });

        console.log("----------------------------------------------------");
        myBoard = []
        i = 0
        row = []

        sleep(1000)
    }


    // sleep(700)
    // //On cree un objet Date
    // var d = new Date
    // //On prend un screenshot a la fin pour montrer qu'on a bien réussi et on lui donne les minutes actuels en tant que nom de fichier
    // await page.screenshot({path: d.getMinutes()+".png"})
    // //On ferme le navigateur et tout les onglets ouvert
    // browser.close();
})()

function get_tile_type(url) {
    switch (url) {
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/AAAAAAB7e3v///9Ql2ugAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
            return "X"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb0AAAB7e3v///9j2HHCAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
            return "x"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEW9vb17e3tXxGy+AAAAEElEQVQI12P4/5+hgYF4BAAJYgl/JfpRmAAAAABJRU5ErkJggg==":
            return "0"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEW9vb3///97e3sAAAD/AABQHuKJAAAAOklEQVQI12MQhAABGIOJQZABDJRADBYHCIPFBcpwcUGIIKsB6zJAZxgbQxjGQIDEQFghoAQBDExQBgCHngoRLPdU8QAAAABJRU5ErkJggg==":
            return "F"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb3///97e3sAAACeVBdNAAAAMklEQVQI12MIDQ0NARFBDAEMDFwMAfwfgISNDYxgABMgMeYDEAKkDoPrtWrVKgYtIAEAf3YRdAzsd6QAAAAASUVORK5CYII=":
            return "?"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3///97e3uVBMaVAAAAHklEQVQI12MIDQ0NARFBDAEMDFzkEl6rVq1i0AISAIlSC03msuDYAAAAAElFTkSuQmCC":
            return "O"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAP97e3u7pKrVAAAAJUlEQVQI12NYBQQMDQxAACUCgAQjiGAFEaIQLiYhGgojEHqBGAB4Gw2cMF3q+AAAAABJRU5ErkJggg==":
            return "1"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AewB7e3vro336AAAANUlEQVQI12NYBQQMDQxAACFCQxkYGkNDHRgaA1gdgGJgIhQowRoCknUAygIZYCVgAqwNQQAA1rsQB7h1rwIAAAAASUVORK5CYII=":
            return "2"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3/AAB7e3uBZQfoAAAAKUlEQVQI12NYBQQMDQxAACYaQ0PBhAOQywojWIFiIAIhBlICJiDaEAQAtlYPHU2zahQAAAAASUVORK5CYII=":
            return "3"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAHt7e3vZn4u5AAAAJklEQVQI12NYBQQMDQxAACFERWFECIxoDA11ABNAJUAuBsGARAAAgHoNeXfAhZYAAAAASUVORK5CYII=":
            return "4"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb17AAB7e3sERFEmAAAAKUlEQVQI12NYBQQMDQxAACYaQ0MdoEQAiBsAEYNIAJWwQgi4Oog2BAEA7gEQV+EiCoQAAAAASUVORK5CYII=":
            return "5"
            break;
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0Ae3t7e3tXnVpnAAAAKklEQVQI12NYBQQMDQxAACFCQxkYGsFEAAOMgIo5ALmsEALMBSmGaEMQAOO9EHd34ZsRAAAAAElFTkSuQmCC":
            return "6"
            break;
        default:
            console.log("ALED CASE INCONUS");
            console.log(url);
            break;
    }
}

function get_tiles(myBoard) {
    let nb = 0
    let nbRows = Object.keys(myBoard).length
    let coord = [0, 0]

    let one = two = three = four = five = six = seven = height = flags = hidden = []


    for (let nb_row in myBoard) {
        let i = 0
        for (let field of myBoard[parseInt(nb_row)]) {
            coord = [parseInt(nb_row), i]

            switch (field) {
                case "1":
                    // one = find_hidden(myBoard, coord, 1, page)
                    one = [...one, coord]

                    // if (Object.keys(hidden).length >= 1) {
                    //     click_on_all(page, board, hidden)
                    // }

                    break;
                case "2":
                    // hidden = find_hidden(myBoard, coord, 2, page)
                    two = [...two, coord]
                    break;
                case "3":
                    // hidden = find_hidden(myBoard, coord, 3, page)
                    three = [...three, coord]
                    break;
                case "4":
                    // hidden = find_hidden(myBoard, coord, 4, page)
                    four = [...four, coord]
                    break;
                case "5":
                    // hidden = find_hidden(myBoard, coord, 5, page)
                    five = [...five, coord]
                    break;
                case "6":
                    six = [...six, coord]
                        // hidden = find_hidden(myBoard, coord, 6, page)
                    break;
                case "7":
                    seven = [...seven, coord]
                        // hidden = find_hidden(myBoard, coord, 6, page)
                    break;
                case "8":
                    height = [...height, coord]
                        // hidden = find_hidden(myBoard, coord, 6, page)
                    break;
                case "F":
                    flags = [...flags, coord]
                    break;
                case "O":
                    hidden = [...hidden, coord]
                    break;
                default:
                    break;
            }
            i++
        }
    }
    return [one, two, three, four, five, six, seven, height, flags, hidden]
}

function check_tiles(board, tiles) {
    let clicks = []
    let left_click = [],
        right_clicks = []

    tiles.forEach((tile_cat, i) => {
        i++
        if (i <= 8) {
            tile_cat.forEach(tile => {
                console.log(tile, i);
                // The type is the tile value [1...8]
                let tile_type = i
                    // Tile number in the page [1,2] = tile nb 11
                let tile_number = tile[0] * 9 + tile[1]

                clicks = get_neighbors(tiles, i, tile)
                left_click = [...left_click, ...clicks[0]]
                right_clicks = [...right_clicks, ...clicks[1]]
            });
        }
    });

    // Click[0] are the left click and clicks[1] the right clicks
    return [left_click, right_clicks]
}

function get_neighbors(tiles, tile_type, tile) {
    // Only one left click possible per case but mutliple right clicks
    let left_click = right_clicks = [];
    let X = tile[0],
        Y = tile[1];
    let newX, newY
    let nb_flags = 0
    let nb_hidden = 0
    let hidden = []

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            // console.log(x,y);
            newX = x + X
            newY = y + Y
            try {
                // console.log("neighbors", tiles[FLAGS], [X, Y], tile_type, [newX, newY]);

                if (tiles[FLAGS].find(flag => flag[0] == newX && flag[1] == newY) != undefined) { // Check if a neighbor is a flag
                    console.log("FLAGS at ", [newX, newY], " for tile : ", tile);
                    nb_flags++
                    if (nb_flags == tile_type && left_click != undefined) {
                        left_click = [tile]
                    }
                } else if (tiles[HIDDEN].find(flag => flag[0] == newX && flag[1] == newY) != undefined) { // Check the number of hidden tiles
                    console.log("HIDDEN at ", [newX, newY], " for tile : ", tile);
                    nb_hidden++
                    hidden = [...hidden, [newX, newY]]
                }
            } catch (error) {
                console.log("Out of range");
            }
        }
    }
    if (nb_hidden == tile_type) { // Check if the nb of hidden tiles is the same as the tile type (If yes it means that we can put a flag on all the hidden tiles)
        right_clicks = [...hidden]
        console.log("-----------------------------------");
        console.log(right_clicks);
        console.log("-----------------------------------");
        // left_click = [tile] // Add the current tile to the left clicks beacause if we add flags to all the hidden tiles we can click on it 
    }
    // console.log(left_click, right_clicks);
    return [left_click, right_clicks]
}

async function click_on_all(page, board, coords) {

    let i = 0
    for (const coord of coords) {
        let tile_nb = coord[0] * 9 + coord[1]
        console.log(tile_nb);
        if (i == tile_nb) {
            try {
                // const preview_coordinates = await field.boundingBox()
                // await field.click({ button: 'left' });
                await page.click('#tile' + tile_nb)
                console.log("Clicked on tile " + tile_nb);

            } catch (error) {
                console.log("Mouse click error : " + error);
            }
            i = 0
        }
        i++
    }
}

/**
 * Click on a certain tile in the board
 * 
 * @param {puppeteer.page} page 
 * @param {[x,y]} tile_coord the coordinates of the tile to click on
 */
function click_on(page, tile_coord) {
    let tile_nb = tile_coord[0] * 9 + tile_coord[1]
        // console.log("click on tilenb: ",tile_nb);
    try {
        if (!tiles_clicked.includes(tile_nb)) {
            page.click('#tile' + tile_nb)
            console.log("Clicked on tile " + tile_nb);
            tiles_clicked = [...tiles_clicked, tile_nb]
        } else {
            console.log("Already clicked ", tile_nb);
        }
    } catch (error) {
        console.log("Mouse click error on tile : " + tile_nb + " \n err : " + error);
    }
}

function add_flags(page, board, hidden_tiles) {
    // console.log("click on tilenb: ",tile_nb);
    hidden_tiles.forEach(tile_coord => {
        let tile_nb = tile_coord[0] * 9 + tile_coord[1]
            // let tile = get_tile_type(await page.$('#tile'+tile_nb))
        try {
            if (board[tile_coord[0]][tile_coord[1]] == "O") {
                // console.log("Try RIGHT click on tile "+tile_nb);
                page.click('#tile' + tile_nb, { button: 'right', delay: 100 });
                console.log("RIGHT Clicked on tile " + tile_nb);
            }
        } catch (error) {
            console.log("Mouse click error on tile : " + tile_nb + " \n err : " + error);
        }
    });
}


function find_hidden(myBoard, coord, type, page) {
    let newCoord = []
    let hidden = []
        // console.log(coord);
    let coord_X = coord[0]
    let coord_Y = coord[1]
    let new_X, new_Y
    let nb_flags = 0
    let nb_hidden = 0

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {

            new_X = coord_X + x
            new_Y = coord_Y + y
                // console.log(coord_X, coord_Y, new_X, coord_Y);
            if (!(new_X < 0 || new_Y < 0 || new_X > 8 || new_Y > 8 || myBoard[new_X][new_Y] === undefined)) {

                // console.log("x: ", x, "  y: ", y, " old coord: ", coord_X,coord_Y, "  boardV: ", myBoard[coord_X][coord_Y]);
                // console.log("x: ", x, "  y: ", y, " new coord: ", new_X,new_Y, "  boardV: ", myBoard[new_X][new_Y]);
                try {
                    if (myBoard[new_X][new_Y] == ("F" || "?")) {
                        // console.log("FOUND FLAG AT ",new_X, new_Y, myBoard[new_X][new_Y]);
                        nb_flags++
                        newCoord = [...newCoord, [new_X, new_Y]]
                    } else if (myBoard[new_X][new_Y] == ("O")) {
                        hidden = [...hidden, [new_X, new_Y]]
                        nb_hidden++
                    } else if (myBoard[new_X][new_Y] == "0") {
                        // newCoord = [...newCoord, [new_X, new_Y]]
                    }
                } catch (error) {
                    console.log("Out of range");
                }
            }
            // console.log("nb flags: ", nb_flags);

            if ((nb_flags) == type) {
                click_on(page, coord)
                return -1
            }
        }
    }
    // console.log("nb hidden : ",nb_hidden);
    if (nb_hidden == type && nb_flags != type) {
        add_flags(page, myBoard, hidden)

        return -1
    }
    return newCoord;
}

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