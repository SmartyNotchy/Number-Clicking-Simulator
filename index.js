function moveToCell(row, col) {
    let cellWidth = document.getElementById("testTD").offsetWidth;
    let playerButton = document.getElementById("playerBtn");

    playerButton.style.transform = "translate(-50%, -50%) translateX(" + 
                                    Math.round(cellWidth * (row - 2)) + "px) translateY(" + Math.round(cellWidth * (col - 2)) + "px)";
}

function calcPercent(num, perc) {
    let temp = num * perc;
    temp /= 100n;
    return temp;
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









function revealShopLogic(price, score) {
    let gap = 1n;
    if (score <= unabbreviateNum("1e")) {
        gap = 1000n;
    } else if (score <= unabbreviateNum("1z")) {
        gap = 1000000000000n;
    } else if (score <= unabbreviateNum("1za")) {
        gap = unabbreviateNum("1z");
    } else if (score <= unabbreviateNum("1caa")) {
        gap = unabbreviateNum("1ga");
    } else {
        gap = unabbreviateNum("1fck");
    }

    return price / score <= gap;
}

class ShopItem {
    constructor(lvl, name, tiers, desc, maxDesc) {
        this.lvl = lvl;
        this.name = name;
        this.tiers = tiers;
        this.desc = desc;
        this.maxDesc = maxDesc;
    }

    updateRow(gameObj) {
        if (revealShopLogic(unabbreviateNum(this.tiers[0][0]), gameObj.score)) {
            document.getElementById("shop" + this.name.replace(/ /g, "-") + "Row").style.display = "inline-block";
        }
        document.getElementById("shop" + this.name.replace(/ /g, "-") + "Name").innerHTML = this.getName();
        document.getElementById("shop" + this.name.replace(/ /g, "-") + "Desc").innerHTML = this.getDesc();
        let btn = document.getElementById("shop" + this.name.replace(/ /g, "-") + "Btn")
        btn.classList.remove("btnAvailable");
        if ((this.lvl + 1) == this.tiers.length) {
            btn.innerHTML = "MAX LVL";
            btn.classList.add("btnMax");
        } else {
            btn.innerHTML = "$" + this.tiers[this.lvl][0];
            if (this.canBuy(gameObj)) {
                btn.classList.add("btnAvailable");
            }
        }
    }

    getEffect() {
        return this.tiers[this.lvl][1];
    }

    getName() {
        return this.name + " | Lv. " + this.lvl;
    }

    getDesc() {
        if ((this.lvl + 1) == this.tiers.length) {
            return this.maxDesc.replace("${0}", this.tiers[this.lvl][1]);
        } else {
            return this.desc.replace("${0}", this.tiers[this.lvl][1]).replace("${1}", this.tiers[this.lvl+1][1]);
        }
    }

    canBuy(gameObj) {
        return ((this.lvl + 1) < this.tiers.length) && (unabbreviateNum(this.tiers[this.lvl][0]) <= gameObj.money);
    }

    buy(gameObj) {
        if (this.canBuy(gameObj)) {
            gameObj.money -= unabbreviateNum(this.tiers[this.lvl][0]);
            this.lvl += 1;
        }
    }
}

class GameManager {
    constructor() {
        this.score = 20000000000n;
        this.money = 20000000000n;
        this.grid = [
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 0n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n
        ];
        
        this.lastClick = 0;
        this.loc = 12;

        this.btnSpeed = 2000;
        this.clearBonus = 0n;
        this.comboTimer = 0;
        this.comboLostInRow = 0;
        this.comboBonus = 0n;
        this.comboLevel = 0;

        this.shop = [
            new ShopItem(0, "Speed",
                [
                    ["8", 1.5],
                    ["1000", 1.25],
                    ["10b", 1],
                    ["10c", 0.75],
                    ["10d", 0.5],
                    ["10e", 0.4],
                    ["10f", 0.35],
                    ["10i", 0.3],
                    ["10k", 0.25],
                    ["10n", 0.2],
                    ["10z", 0.15],
                    ["10zz", 0.1]
                ],
            "Traveling between cells takes<br>${0} -> ${1}s",
            "Traveling between cells takes ${0}s"),

            new ShopItem(0, "Clear Bonus",
                [
                    ["12", 0n],
                    ["2000", 10n],
                    ["10b", 20n],
                    ["100c", 30n],
                    ["10e", 40n],
                    ["10h", 50n],
                    ["10k", 60n],
                ],
            "Gain ${0}% -> ${1}% of your score when clearing a board",
            "Gain ${0}% of your score when clearing a board"),

            new ShopItem(0, "Combo",
                [
                    ["10b", 0n],
                    [undefined, 20n],
                ],
            "Successful clicks in rapid succession earn up to<br> ${0}% -> ${1}% more points",
            "Successful clicks in rapid succession earn up to ${0}% more points"),

            new ShopItem(0, "Accumulator",
                [
                    ["10e", 0n],
                    ["10f", 1n],
                    [undefined, 2n]
                ],
            "Gain ${0}% -> ${1}% of your score every second",
            "Gain ${0}% of your score every second")
        ]
    }

    loadDataCookies() {
        console.log("Data Not Found; Starting new game...");
    }

    saveDataCookies() {

    }

    applyShop() {
        this.btnSpeed = this.shop[0].getEffect() * 1000;
        document.getElementById("playerBtn").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";

        this.clearBonus = this.shop[1].getEffect();

        this.comboBonus = this.shop[2].getEffect() / 10n;
        if (this.comboBonus != 0) {
            document.getElementById("comboText").style.visibility = "visible";
            document.getElementById("comboBar").style.visibility = "visible";
        }
    }

    updateCombo() {
        if (this.comboLevel != 0) {
            let timeouts = [0, 1000, 1000, 1000, 750, 750, 600, 600, 500, 500, 400];
            let currentTime = Date.now();
            if ((this.comboLostInRow == 0 && currentTime - this.comboTimer > timeouts[this.comboLevel]) ||
                (this.comboLostInRow > 0 && currentTime - this.comboTimer > 125)) {
                this.comboLevel -= 1;
                this.comboTimer = currentTime;
                this.comboLostInRow += 1;
            }
        }
        

        let playerBtn = document.getElementById("playerBtn");
        for (let i = 1; i <= 10; i++) {
            let bar = document.getElementById("cmb" + i);
            if (i <= this.comboLevel) {
                bar.classList.add("cmbOn");
            } else {
                bar.classList.remove("cmbOn");
            }

            if (i == this.comboLevel) {
                playerBtn.classList.add("cmb" + i + "bdr");
            } else {
                playerBtn.classList.remove("cmb" + i + "bdr")
            }
        }
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

            if (this.comboBonus != 0 && this.grid[id] != 0n) {
                this.score += calcPercent(this.grid[id], this.comboBonus * BigInt(this.comboLevel));
                this.comboLostInRow = 0;
                this.comboLevel += 1;
                if (this.comboLevel > 10) {
                    this.comboLevel = 10
                }
                this.comboTimer = Date.now();
                
                let bar = document.getElementById("cmb" + this.comboLevel);
                this.updateCombo();
                bar.classList.add('pulse');
                // After a short delay, remove the pulse class to return to normal size
                setTimeout(() => {
                    bar.classList.remove('pulse');
                }, 50);
            }

            this.money += this.grid[id];
            this.grid[id] = 0n;
            this.updateBoard();
            this.updateHUD();
            this.updateShop();
            this.loc = id;

            if (this.isClear()) {
                // Board Clear!
                this.lastClick = Date.now();
                moveToCell(2, 2);
                this.loc = 12;

                this.score += calcPercent(this.score, this.clearBonus);
                setTimeout(function() {
                    GAME_MANAGER.generateBoard();
                }, this.btnSpeed);
            }
        } else {
            this.lastClick = Date.now();
            this.comboLevel = 0;
            this.comboLostInRow = 0;
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
        this.updateShop();
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
        for (let idx = 0; idx < this.shop.length; idx++) {
            this.shop[idx].updateRow(this);
        }
    }

    buyShop(id) {
        this.shop[id].buy(this);
        this.updateShop();
        this.updateHUD();
        this.updateBoard();
        this.applyShop();
    }
}

var GAME_MANAGER = new GameManager();

for (let idx = 1; idx <= 25; idx++) {
    document.getElementById("numBtn" + idx).onclick = (() => { GAME_MANAGER.processClick(idx - 1); });
}

for (let idx = 0; idx < GAME_MANAGER.shop.length; idx++) {
    let shopObj = GAME_MANAGER.shop[idx];
    document.getElementById("shop" + shopObj.name.replace(/ /g, "-") + "Btn").onclick = (() => { GAME_MANAGER.buyShop(idx) });
}
GAME_MANAGER.loadDataCookies();
GAME_MANAGER.updateBoard();
GAME_MANAGER.updateHUD();
GAME_MANAGER.updateShop();
GAME_MANAGER.applyShop();

// Gameloop
setInterval(function() {
    // Combo Bar
    GAME_MANAGER.updateCombo();

    // Accumulator
    
    // Playtime
}, 25);