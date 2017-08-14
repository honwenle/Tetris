var ctx = document.getElementById('can').getContext('2d');
var freezeList = [],
    nowList = [],
    nextList = [],
    dir = 0,
    nowIndex = 0,
    isPause = false,
    isOver = false,
    clearRows = [],
    score = 0,
    speed = 500,
    lv = 0;
var typeList = [
    [44, 45, 64, 65], // O
    [64, 44, 24 ,4], // I
    [64, 65, 45, 46], // S
    [64, 65, 44, 43], // Z
    [64, 65, 44, 24], // L
    [64, 65, 45, 25], // J
    [64, 44, 43, 45] // T
];
var scoreList = [0, 100, 250, 400 ,800];
var colorList = ['#0ff','#0f0', '#f0f', '#60f', '#f60', '#f00', '#ff0'];
function getID (row, col) {
    return row * 20 + col;
}
function getXY (id) {
    return {
        row: ~~(id / 20),
        col: id % 20,
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
function drawFreeze () {
    ctx.clearRect(0, 100, 200, 400);
    ctx.fillStyle = '#888';
    freezeList.forEach(function(n) {
        var xy = getXY(n);
        ctx.fillRect(xy.x, xy.y, 18, 18);
    });
}
function newList () {
    clearRows = [];
    nowIndex = Math.floor(Math.random() * colorList.length);
    nowList = typeList[nowIndex];
}
function rotate () {
    var xyList = [];
    var xy = getXY(nowList[0]);
    var maxRow = 0,
        maxCol = 0,
        minRow = xy.row,
        minCol = xy.col;
    nowList.forEach(function (n) {
        var xy = getXY(n);
        maxRow = Math.max(maxRow, xy.row);
        maxCol = Math.max(maxCol, xy.col);
        minRow = Math.min(minRow, xy.row);
        minCol = Math.min(minCol, xy.col);
    });
    overCol = Math.max(maxRow + minCol - minRow - 9, 0);
    nowList.forEach(function (n) {
        var xy = getXY(n);
        xyList.push(getID(xy.col - minCol + minRow, -xy.row + maxRow + minCol - overCol));
    });
    return xyList;
}
function move () {
    if (isPause || isOver) {
        return false;
    }
    if (dir == 'r') {
        nextList = rotate();
    } else if(dir) {
        nextList = nowList.map(function (n) {
            return n + dir;
        });
    }
    var canMove = true, canFreeze = false;
    nextList.forEach(function (n) {
        if (n%20==19 || n%20==10 || n > 499) {
            canMove = false;
        }
        if (dir != 20 && freezeList.indexOf(n) > -1) {
            canMove = false;
        } else if (dir == 20) {
            if (n > 499 || freezeList.indexOf(n) > -1) {
                canFreeze = true;
            }
        }
    });
    if (canFreeze) {
        freezeList = freezeList.concat(nowList);
        drawFreeze();
        var waitOver = false;
        nowList.forEach(function (n) {
            var start = n - n % 20,
                canClear = true;
            for (var i = 0; i < 10; i++) {
                if (freezeList.indexOf(i+start) < 0) {
                    canClear = false;
                    break;
                }
            }
            if (canClear) {
                if (clearRows.indexOf(start) < 0) {
                    clearRows.push(start);
                }
            } else if (n < 60) {
                waitOver = true;
            }
        });
        if (clearRows.length > 0) {
            clear();
        } else if (waitOver) {
            isOver = true;
            alert('得分：' + score);
        }
        newList();
    } else if (canMove) {
        draw(nowList, '#000');
        nowList = nextList;
        nextList = [];
        draw(nowList);
    }
}
function showScore () {
    score += scoreList[clearRows.length];
    lv = ~~(score / 1000);
    speed = speed * Math.sqrt(.8, lv);
    ctx.clearRect(0, 0, 200, 18);
    ctx.font = '18px 微软雅黑';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 0, 18);
}
function clear () {
    showScore();
    clearRows.sort();
    clearRows.forEach(function (start) {
        freezeList = freezeList.filter(function (n) {
            return n < start || n >= start + 20;
        });
        freezeList = freezeList.map(function (n) {
            return n < start ? n + 20 : n;
        });
    });
    drawFreeze();
}
function update () {
    if (isOver) {
        return false;
    }
    dir = 20;
    move();
    setTimeout(update, speed);
}
document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        isPause = !isPause;
    }
    dir = [-1, 'r', 1, 20][(e||event).keyCode - 37] || 0;
    dir && move();
};

function drawLine () {
    ctx.clearRect(0, 0, 200, 500);
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.moveTo(0, 100);
    ctx.lineTo(200, 100);
    ctx.stroke();
    ctx.closePath();
}
function init () {
    freezeList = [];
    nowList = [];
    nextList = [];
    isPause = false;
    score = 0;
    drawLine();
    newList();
    update();
    showScore();
}
init();