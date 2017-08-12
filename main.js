var ctx = document.getElementById('can').getContext('2d');
var isPause = false;
var freezeList = [],
    nowList = [],
    nextList = [],
    dir = 0;
var typeList = [
    [44, 45, 64, 65], // O
    [64, 44, 24 ,4], // I
    [64, 65, 45, 46], // S
    [64, 65, 44, 43], // Z
    [64, 65, 44, 24], // L
    [64, 65, 45, 25], // J
    [64, 44, 43, 45] // T
];
var colorList = ['#0ff','#0f0', '#f0f', '#60f', '#f60', '#f00', '#ff0'],
    nowIndex = 0;
function getID (x, y) {}
function getXY (id) {
    return {
        x: id % 20 * 20 + 1,
        y: ~~(id / 20) * 20 + 1
    }
}
function draw (obj, color) {
    ctx.fillStyle = color || colorList[nowIndex];
    obj.forEach(function(n) {
        var xy = getXY(n);
        ctx.fillRect(xy.x, xy.y, 18, 18);
    });
}
function newList () {
    nowIndex = Math.floor(Math.random() * colorList.length);
    nowList = typeList[nowIndex];
}
function move () {
    if (isPause) {
        return false;
    }
    nextList = nowList.map(function (n) {
        return n + dir;
    });
    var canMove = true, canFreeze = false;
    nextList.forEach(function (n) {
        if (dir==-1 && n%20==19 || dir==1 && n%20==10) {
            canMove = false;
        }
        if ((dir==-1 || dir==1) && freezeList.indexOf(n) > -1) {
            canMove = false;
        } else if (n > 499 || dir==20 && freezeList.indexOf(n) > -1) {
            canFreeze = true;
        }
    });
    if (canFreeze) {
        freezeList = freezeList.concat(nowList);
        // TODO: 检查、消除
        // TODO: 判断死亡
        newList();
        return false;
    }
    if (canMove) {
        draw(nowList, '#000');
        nowList = nextList;
        nextList = [];
        draw(nowList);
    }
}
function rotate (x, y) {}
function update () {
    dir = 20;
    move();
    setTimeout(update, 500);
}
document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        isPause = !isPause;
    }
    dir = [-1, 'r', 1, 20][(e||event).keyCode - 37] || 0;
    if (dir == 'r') {
        rotate();
    } else if(dir) {
        move();
    }
};

function drawLine () {
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.moveTo(0, 100);
    ctx.lineTo(200, 100);
    ctx.stroke();
    ctx.closePath();
}
function init () {
    drawLine();
    newList();
    update();
}
init();