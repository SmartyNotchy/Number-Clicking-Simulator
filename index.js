function moveToCell(row, col) {
    let cellWidth = document.getElementById("testTD").offsetWidth;
    let playerButton = document.getElementById("playerBtn");
    let playerButtonBG = document.getElementById("playerBtnBG");

    playerButton.style.transform = "translate(-50%, -50%) translateX(" + 
                                    Math.round(cellWidth * (row - 2)) + "px) translateY(" + Math.round(cellWidth * (col - 2)) + "px)";
    playerButtonBG.style.transform = "translate(-50%, -50%) translateX(" + 
                                    Math.round(cellWidth * (row - 2)) + "px) translateY(" + Math.round(cellWidth * (col - 2)) + "px)";
    playerButtonBG.style.setProperty("--x", Math.round(cellWidth * (row - 2)) + "px");
    playerButtonBG.style.setProperty("--y", Math.round(cellWidth * (col - 2)) + "px");

}

function formatTimeDiff(num) {
    let seconds = num / 1000;
    let hours = Math.floor(seconds / 3600);
    seconds -= 3600 * hours;
    let minutes = Math.floor(seconds / 60);
    seconds -= 60 * minutes;

    return "" + hours + "h " + minutes + "m " + Math.floor(seconds * 100) / 100 + "s";
}

function calcPercent(num, perc) {
    let temp = num * perc;
    temp /= 100n;
    return temp;
}

function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (36500*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
        gap = unabbreviateNum("1cc");
    } else if (score <= unabbreviateNum("1aaa")) {
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
        this.score = 2n;
        this.money = 0n;
        this.grid = [
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            1n, 1n, 0n, 1n, 1n,
            1n, 1n, 1n, 1n, 1n,
            10n, 20n, 30n, 40n, 50n
        ];
        
        this.lastClick = 0;
        this.loc = 12;
        this.start = Date.now();
        this.end = 0;

        this.btnSpeed = 2000;
        this.clearBonus = 0n;
        this.comboTimer = 0;
        this.comboLostInRow = 0;
        this.comboBonus = 0n;
        this.comboLevel = 0;
        this.accumulator = 0n;
        this.maxComboBonusTime = 0;
        this.addFreebie;

        this.shop = [
            new ShopItem(0, "Speed",
                [
                    ["5", 1.5],
                    ["100", 1.25],
                    ["10b", 1],
                    ["10c", 0.9],
                    ["10d", 0.8],
                    ["10e", 0.7],
                    ["10f", 0.6],
                    ["10i", 0.5],
                    ["10k", 0.45],
                    ["10n", 0.4],
                    ["10z", 0.35],
                    ["10bb", 0.3],
                    ["10jk", 0.25],
                    ["10sp", 0.2],
                    ["10aaa", 0.15],
                    ["10bbb", 0.1],
                ],
            "Traveling between cells takes<br>${0} -> ${1}s",
            "Traveling between cells takes ${0}s"),

            new ShopItem(0, "Clear Bonus",
                [
                    ["20", 0n],
                    ["2000", 10n],
                    ["10b", 20n],
                    ["100c", 30n],
                    ["10e", 50n],
                    ["10h", 75n],
                    ["10k", 100n],
                    ["10n", 200n],
                    ["10q", 400n],
                    ["10w", 800n],
                    ["10z", 1600n],
                    ["10ap", 3200n],
                    ["10gg", 6400n],
                    ["10aaa", 12800n],
                    ["10awe", 100000n],
                    [undefined, 1000000n]
                ],
            "Gain ${0}% -> ${1}% of your score when clearing a board",
            "Gain ${0}% of your score when clearing a board"),

            new ShopItem(0, "Combo",
                [
                    ["10b", 0n],
                    ["10c", 20n],
                    ["10d", 40n],
                    ["10e", 60n],
                    ["10f", 80n],
                    ["10g", 100n],
                    ["10k", 200n],
                    ["10q", 400n],
                    ["10z", 800n],
                    ["10al", 1600n],
                    ["10bp", 3200n],
                    ["10cm", 6400n],
                    ["10aaa", 12800n],
                    ["10app", 100000n],
                    ["10cmb", 1000000n],
                    [undefined, 100000000000n]
                ],
            "Successful clicks in rapid succession earn up to<br> ${0}% -> ${1}% more points",
            "Successful clicks in rapid succession earn up to ${0}% more points"),

            new ShopItem(0, "Accumulator",
                [
                    ["10e", 0n],
                    ["10f", 1n],
                    ["10p", 2n],
                    ["10z", 3n],
                    ["10af", 4n],
                    ["10ee", 5n],
                    ["10kk", 6n],
                    ["10tt", 7n],
                    ["10aaa", 8n],
                    ["10bbb", 9n],
                    [undefined, 10n]
                ],
            "Gain ${0}% -> ${1}% of your score every second",
            "Gain ${0}% of your score every second"),

            new ShopItem(0, "To The Moon",
                [
                    ["10h", 0n],
                    ["10j", 50n],
                    ["10l", 100n],
                    ["10p", 200n],
                    ["10u", 400n],
                    ["10z", 800n],
                    ["10ah", 1600n],
                    ["10by", 3200n],
                    ["10ty", 6400n], 
                    ["10buy", 12800n]
                ],
            "Cells grant ${0}% -> ${1}% more cash",
            "Cells grant ${0}% more cash"),
            
            new ShopItem(0, "Roll The Dice",
                [
                    ["10r", 0],
                    ["10z", 1],
                    ["10lk", 2],
                    ["10zz", 5],
                    ["10all", 10],
                    ["10axe", 20],
                    ["10big", 50],
                    [undefined, 100]
                ],
            "Cells have a ${0}% -> ${1}% chance to grant x10 score & cash. Applied before <em>Combo</em>.",
            "Cells have a ${0}% chance to grant x10 score & cash. Applied before <em>Combo</em>."),

            new ShopItem(0, "ComboCumulate",
                [
                    ["10cc", false],
                    [undefined, true]
                ],
            "Combo will now affect <em>Clear Bonus</em>, <em>Accumulator</em>, and <em>To The Moon</em>",
            "Combo now affects <em>Clear Bonus</em>, <em>Accumulator</em>, and <em>To The Moon</em>"),

            new ShopItem(0, "Overkill",
                [
                    ["10ee", 0n],
                    ["10kk", 10n],
                    ["10aaa", 25n],
                    ["10bet", 50n],
                    [undefined, 80n]
                ],
            "Cells have a minimum value of ${0}% -> ${1}% of your score in calculations. Applied before <em>Roll The Dice</em> and <em>Combo</em>.",
            "Cells have a minimum value of ${0}% of your score in calculations. Applied before <em>Roll The Dice</em> and <em>Combo</em>."),

            new ShopItem(0, "Undying Light",
                [
                    ["10fl", 0],
                    ["10gg", 500],
                    ["10ii", 700],
                    ["10zz", 900],
                    [undefined, 1000]
                ],
            "Adds ${0} -> ${1} ms of leeway for holding a Level 10 Combo",
            "Adds ${0} ms of leeway for holding a Level 10 Combo"),

            new ShopItem(0, "Freebie",
                [
                    ["10pp", false],
                    [undefined, true]
                ],
            "Adds a single cell with value 1 to new boards",
            "Adds a single cell with value 1 to new boards"),

            new ShopItem(0, "You Win",
                [
                    ["10day", 0n],
                    [undefined, 10n]
                ],
            "<em>Finally, free at last.<em>",
            "</em>Finally, free at last.</em>")
        ]
    }

    loadDataCookies() {
        let savestring = getCookie("savestring");

        if (savestring == "") {
            console.log("Data Not Found; Starting new game...");
            return;
        }

        savestring = savestring.split(" ");
        this.score = unabbreviateNum(savestring[0]);
        this.money = unabbreviateNum(savestring[1]);
        for (let i = 2; i < 27; i++) {
            this.grid[i-2] = unabbreviateNum(savestring[i]);
        }
        for (let i = 0; i < this.shop.length; i++) {
            this.shop[i].lvl = Number(savestring[i+27]);
        }

        this.start = Number(savestring[this.shop.length + 27]);
        this.end = Number(savestring[this.shop.length + 28]);

        this.applyShop();

        if (this.isClear()) {
            let temp = calcPercent(this.score, this.clearBonus);
            if (this.comboStacks) {
                temp += calcPercent(temp, this.comboBonus * BigInt(this.comboLevel));
            }
            this.score += temp;
            this.resetBoard();
        }
    }

    resetDataCookies() {
        setCookie("savestring", "");
    }

    saveDataCookies() {
        let savestring = "";
        savestring += abbreviateNum(this.score);
        savestring += " " + abbreviateNum(this.money);
        for (let i = 0; i < 25; i++) {
            savestring += " " + abbreviateNum(this.grid[i]);
        }

        for (let i = 0; i < this.shop.length; i++) {
            savestring += " " + this.shop[i].lvl;
        }
        
        savestring += " " + this.start + " " + this.end;

        setCookie("savestring", savestring);
    }

    applyShop() {
        this.btnSpeed = this.shop[0].getEffect() * 1000;
        if (this.comboLevel < 10) {
            document.getElementById("playerBtn").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";
            document.getElementById("playerBtnBG").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";
        }

        this.clearBonus = this.shop[1].getEffect();

        this.comboBonus = this.shop[2].getEffect() / 10n;
        if (this.comboBonus != 0) {
            document.getElementById("comboText").style.visibility = "visible";
            document.getElementById("comboBar").style.visibility = "visible";
        }

        this.accumulator = this.shop[3].getEffect();

        this.cashBonus = this.shop[4].getEffect();

        this.bonusChance = this.shop[5].getEffect();

        this.comboStacks = this.shop[6].getEffect();

        this.minPercent = this.shop[7].getEffect();

        this.maxComboBonusTime = this.shop[8].getEffect();

        this.addFreebie = this.shop[9].getEffect();

        if (this.end == 0 && this.shop[10].getEffect()) {
            this.end = Date.now();
        }
    }

    updateCombo() {
        if (this.comboLevel != 0) {
            let timeouts = [0, 1500, 1500, 1500, 1000, 1000, 750, 750, 650, 650, 500 + this.maxComboBonusTime];
            let currentTime = Date.now();
            if ((this.comboLostInRow == 0 && currentTime - this.comboTimer > timeouts[this.comboLevel]) ||
                (this.comboLostInRow > 0 && currentTime - this.comboTimer > 125)) {
                this.comboLevel -= 1;
                this.comboTimer = currentTime;
                this.comboLostInRow += 1;

                this.btnSpeed = this.shop[0].getEffect() * 1000;
                document.getElementById("playerBtn").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";
            }
        }
        

        let playerBtnBG = document.getElementById("playerBtnBG");
        for (let i = 1; i <= 10; i++) {
            let bar = document.getElementById("cmb" + i);
            if (i <= this.comboLevel) {
                bar.classList.add("cmbOn");
            } else {
                bar.classList.remove("cmbOn");
            }

            if (i == this.comboLevel) {
                playerBtnBG.classList.add("cmb" + i + "bg");
            } else {
                playerBtnBG.classList.remove("cmb" + i + "bg")
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
            let minVal = calcPercent(this.score, this.minPercent);
            if (this.grid[id] < minVal) {
                this.grid[id] = minVal;
            }

            if (Math.random() < this.bonusChance / 100) {
                this.grid[id] *= 10n;
            }

            this.score += this.grid[id];

            if (this.comboBonus != 0 && this.grid[id] != 0n) {
                this.score += calcPercent(this.grid[id], this.comboBonus * BigInt(this.comboLevel));
                this.comboLostInRow = 0;
                this.comboLevel += 1;
                if (this.comboLevel >= 10) {
                    this.comboLevel = 10;
                    this.btnSpeed = 0;
                    document.getElementById("playerBtn").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";
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
            let temp = calcPercent(this.grid[id], this.cashBonus)
            if (this.comboStacks) {
                temp += calcPercent(temp, this.comboBonus * BigInt(this.comboLevel));
            }
            this.money += temp;

            this.grid[id] = 0n;
            this.updateBoard();
            this.updateHUD();
            this.updateShop();
            this.loc = id;

            if (this.isClear()) {
                // Board Clear!
                let temp = calcPercent(this.score, this.clearBonus);
                if (this.comboStacks) {
                    temp += calcPercent(temp, this.comboBonus * BigInt(this.comboLevel));
                }
                this.score += temp;
                this.resetBoard();
            }

            this.saveDataCookies();
        } else {
            this.lastClick = Date.now();
            this.comboLevel = 0;
            this.comboLostInRow = 0;
            this.btnSpeed = this.shop[0].getEffect() * 1000;
            document.getElementById("playerBtn").style.transition = "transform " + this.btnSpeed + "ms ease-in-out";
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
            if (i == 0 && this.addFreebie) {
                values.push(1n);
                continue;
            }
            let temp = BigInt(this.calcBoardScaling()) * last
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

    calcBoardScaling() {
        let percentRange = 0.2
        let minPercent = 0.2;

        minPercent += 0.02 * this.shop[2].lvl;
        percentRange += 0.02 * this.shop[2].lvl;
        
        minPercent += 0.02 * Number(this.accumulator);

        if (this.comboStacks) {
            minPercent *= 1.2;
            percentRange *= 1.2;
        }

        minPercent = Math.min(minPercent, 0.5);
        percentRange = Math.min(percentRange, 1);
        
        return Math.round(100 * (Math.random() * percentRange + minPercent))
    }

    resetBoard() {
        this.lastClick = Date.now();
        moveToCell(2, 2);
        this.loc = 12;

        setTimeout(function() {
            GAME_MANAGER.generateBoard();
        }, this.btnSpeed);
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
        if (this.end > 0) {
            document.getElementById("playtimeHeader").innerHTML = "Time to Win:";
            document.getElementById("playtimeText").innerHTML = formatTimeDiff(this.end - this.start);
        } else {
            document.getElementById("playtimeHeader").innerHTML = "Time Since Start:";
            document.getElementById("playtimeText").innerHTML = formatTimeDiff(Date.now() - this.start);
        }
    }

    updateShop() {
        for (let idx = 0; idx < this.shop.length; idx++) {
            this.shop[idx].updateRow(this);
        }
    }

    updateAll() {
        this.updateShop();
        this.updateHUD();
        this.updateBoard();
        this.applyShop();
    }

    buyShop(id) {
        this.shop[id].buy(this);
        this.updateAll();
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
let counter = 0;
setInterval(function() {
    counter += 1;
    counter = counter % 40;

    // Combo Bar
    GAME_MANAGER.updateCombo();

    // Accumulator
    if (GAME_MANAGER.accumulator > 0 && counter == 0) {
        let temp = calcPercent(GAME_MANAGER.score, GAME_MANAGER.accumulator);
        if (GAME_MANAGER.comboStacks) {
            temp += calcPercent(temp, GAME_MANAGER.comboBonus * BigInt(GAME_MANAGER.comboLevel));
        }
        GAME_MANAGER.score += temp;
    }

    GAME_MANAGER.updateAll();
    // Playtime
}, 25);

function promptReset() {
    let res = prompt("Reset all data? This will start the entire 'game' over.\n\nEnter RESET in the box to confirm.");
    if (res == "RESET") {
        GAME_MANAGER.resetDataCookies();
        location.reload();
    }
}