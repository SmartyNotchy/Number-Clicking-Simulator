function moveToCell(row, col) {
    let cellWidth = document.getElementById("testTD").offsetWidth;
    let playerButton = document.getElementById("playerBtn");

    playerButton.style.transform = "translate(-50%, -50%) translateX(" + 
                                    Math.round(cellWidth * (row - 2)) + "px) translateY(" + Math.round(cellWidth * (col - 2)) + "px)";
}

const alphabet = "abcdefghijklmnopqrstuvwxyz"
function abbreviateNum(num) {
    let numStr = String(num);
    if (num < 1000n) {
        return numStr;
    }

    let count = 0;
    while (num >= 10000n) {
        num = num / 1000n;
        count++;
    }

    let suffix = '';
    while (count > 0) {
        count--;
        suffix = alphabet[(count % 26)] + suffix;
        count = Math.floor(count / 26);
    }

    return num + suffix;
}

function unabbreviateNum(abrNum) {
    let num = BigInt(abrNum.match(/\d+/)[0]);
    let suf = abrNum.replace(/\d+/,'');
    
    let mult = 0n;
    for (let i = 0; i < suf.length; i++) {
        let temp = BigInt(alphabet.indexOf(suf[i]) + 1);
        temp *= 26n ** BigInt(suf.length - i - 1);
        mult += temp;
    }
    
    mult = 1000n ** mult;
    return num * mult;
}

/* Test AbbreviateNum
let x = 0;
let testNum = 1n;
for (let i = 0; i < 100; i++) {
    console.log(abbreviateNum(testNum));
    testNum *= 100n;
}
*/

function shuffle(array) {
    let currentIndex = array.length;
  
    while (currentIndex != 0) {
  
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}











const PLAYER_SPEED_SHOP = [
    // id, price, button speed
    [0, "10", 2500],
    [1, "100", 2250],
    [2, "1a", 2000],
    [3, "1b", 1900],
    [4, "1c", 1800],
    [5, "1d", 1700],
    [6, "1e", 1600],
    [7, "1f", 1500],
    [8, "1g", 1400],
    [9, "1h", 1300],
    [10, "1i", 1200],
    [11, "1j", 1100],
    [12, "1k", 1000]
]

class GameManager {
    constructor() {
        this.score = 2n;
        this.money = 0n;
        this.grid = [
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 0n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n
        ];
    }

    loadDataCookies() {
        console.log("Data Not Found; Starting new game...");

        this.score = 2n;
        this.money = 0n;
        this.grid = [
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 0n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n
        ];

        this.lastClick = 0;
        this.loc = 12;

        this.btnSpeed = 200;
        this.upgrades = [
            0,
            0,
            0,
            0,
        ]
    }

    saveDataCookies() {

    }

    processClick(id) {
        if (id == this.loc) {
            return;
        }
        let currentTime = Date.now();
        if (currentTime - this.lastClick < this.btnSpeed) {
            return;
        }

        this.lastClick = currentTime;
        moveToCell(id % 5, Math.floor(id/5));

        setTimeout(function() {
            GAME_MANAGER.consumeCell(id);
        }, this.btnSpeed);
    }

    consumeCell(id) {
        if (this.grid[id] < this.score) {
            this.score += this.grid[id];
            this.grid[id] = 0n;
            this.updateBoard();
            this.updateHUD();
            this.loc = id;

            if (this.isClear()) {
                this.lastClick = Date.now();
                moveToCell(2, 2);
                this.loc = 12;
                setTimeout(function() {
                    GAME_MANAGER.generateBoard();
                }, this.btnSpeed);
            }
        } else {
            this.lastClick = Date.now();
            moveToCell(this.loc % 5, Math.floor(this.loc / 5));
        }
    }

    isClear() {
        for (let i = 0; i < 25; i++) {
            if (this.grid[i] != 0n) {
                return false;
            }
        }
        return true;
    }

    generateBoard() {
        let values = [];
        let last = this.score;

        for (let i = 0; i < 24; i++) {
            let temp = BigInt(Math.round(100 * (Math.random() * 0.2 + 0.2))) * last
            temp /= 100n;
            last += temp;
            values.push(temp)
        }

        shuffle(values);
        values[24] = values[12];
        values[12] = 0n;
        this.grid = values;
        this.updateBoard();
        this.updateHUD();
    }

    updateBoard() {
        for (let idx = 0; idx < 25; idx++) {
            document.getElementById("numBtn" + (idx+1)).innerHTML = (this.grid[idx] == 0n ? "‎" : abbreviateNum(this.grid[idx]));
        }
        document.getElementById("playerBtn").innerHTML = abbreviateNum(this.score);
    }

    updateHUD(id) {
        document.getElementById("scoreText").innerHTML = "Score: " + abbreviateNum(this.score);
        document.getElementById("cashText").innerHTML = "$" + abbreviateNum(this.money);
    }

    updateShop() {

    }

    buyShop(id) {

    }
}

var GAME_MANAGER = new GameManager();

function processClick(id) {
    GAME_MANAGER.processClick(id);
}

for (let idx = 1; idx <= 25; idx++) {
    document.getElementById("numBtn" + idx).onclick = (() => { processClick(idx-1) });
}

GAME_MANAGER.loadDataCookies();
GAME_MANAGER.updateBoard();
GAME_MANAGER.updateHUD();