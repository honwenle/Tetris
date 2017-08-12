var ctx = document.getElementById('can').getContext('2d');
var freezeList = [],
    nowList = [],
    nextList = [],
    dir = 0,
    nowIndex = 0,
    isPause = false,
    isOver = false,
    clearRows = [];
var typeList = [
    [44, 45, 64, 65], // O
    [64, 44, 24 ,4], // I
    [64, 65, 45, 46], // S
    [64, 65, 44, 43], // Z
    [64, 65, 44, 24], // L
    [64, 65, 45, 25], // J
    [64, 44, 43, 45] // T
];
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
    var offset = getXY(Math.min.apply(null, nowList))
    nowList.forEach(function (n) {
        var xy = getXY(n);
        xyList.push(getID(xy.col - offset.col + offset.row, -xy.row + offset.row + 3 + offset.col - 2));
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
            console.log('over')
        }
        newList();
    } else if (canMove) {
        draw(nowList, '#000');
        nowList = nextList;
        nextList = [];
        draw(nowList);
    }
}
function clear () {
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
    setTimeout(update, 500);
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
    drawLine();
    newList();
    update();
}
init();