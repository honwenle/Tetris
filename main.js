var ctx = document.getElementById('can').getContext('2d');
var isPause = false;
var freezeList = [],
    nowList = {},
    nextList = {},
    dir = 0;
var typeList = [
    {
        arr: [44, 45, 64, 65],
        color: '#0ff'
    }
];
function getID (x, y) {}
function getXY (id) {
    return {
        x: id % 20 * 20 + 1,
        y: ~~(id / 20) * 20 + 1
    }
}
function draw (obj, color) {
    ctx.fillStyle = color || obj.color;
    obj.arr.forEach(function(n) {
        var xy = getXY(n);
        ctx.fillRect(xy.x, xy.y, 18, 18);
    });
}
function newList () {
    nowList = typeList[0];
}
function move () {
    if (isPause) {
        return false;
    }
    nextList.color = nowList.color;
    nextList.arr = nowList.arr.map(function (n) {
        return n + dir;
    });
    var canMove = true, canFreeze = false;
    nextList.arr.forEach(function (n) {
        if (dir==-1 && n%20==19 || dir==1 && n%20==10) {
            canMove = false;
        }
        if (n > 499 || freezeList.indexOf(n) > -1) {
            canFreeze = true;
        }
    });
    if (canFreeze) {
        freezeList = freezeList.concat(nowList.arr);
        newList();
        return false;
    }
    if (canMove) {
        draw(nowList, '#000');
        nowList = nextList;
        nextList = {};
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