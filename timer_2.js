let t1, t2;
let running1 = false;
let running2 = false;
let i1 = 0,
    i2 = 0;
let row = 0;
let time;
let num1 = 1,
    num2 = 1;
let s1 = 0,
    s2 = 0;
let bestAo5_1 = 1000;
let bestAo12_1 = 1000;
let bestAo5_2 = 1000;
let bestAo12_2 = 1000;
let media = window.matchMedia('only screen and (max-width: 800px)')

document.addEventListener('keyup', startSpace);
document.addEventListener('keydown', stopSpace);
document.addEventListener('keyup', startEnter);
document.addEventListener('keydown', stopEnter);
document.addEventListener('keydown', ColorChangeGreen);
document.addEventListener('keyup', ColorChangeBlack);


window.onload = function fir() {
    localStorage.clear();
    randomString();
    i1 = 0;
    i2 = 0;
    row = 0;
    const watch1 = document.getElementById('con1');
    const watch2 = document.getElementById('con2');

    const w1 = document.getElementById('timer1');
    const w2 = document.getElementById('timer2');
    watch1.addEventListener('touchstart', () => {
        //color to green
        w1.style.color = 'green';
        s1 = 1;
    });
    watch1.addEventListener('touchend', () => {
        //color to black
        w1.style.color = 'black';
        s1 = 0;
    });
    watch2.addEventListener('touchstart', () => {
        //color to green
        w2.style.color = 'green';
        s2 = 1;
    });
    watch2.addEventListener('touchend', () => {
        //color to white
        w2.style.color = 'white';
        s2 = 0;
    });
    watch1.addEventListener('touchend', startSpace);
    watch2.addEventListener('touchend', startEnter);
    watch1.addEventListener('touchstart', stopSpace);
    watch2.addEventListener('touchstart', stopEnter);
}

function ColorChangeGreen(event) {
    if (event.keyCode === 32) {
        document.getElementById('timer1').style.color = 'green';
        s1 = 1;
    } else if (event.keyCode === 13) {
        document.getElementById('timer2').style.color = 'green';
        s2 = 1;
    }
}

function ColorChangeBlack(event) {
    if (event.keyCode === 32) {
        document.getElementById('timer1').style.color = 'black';
        s1 = 0;
    } else if (event.keyCode === 13) {
        document.getElementById('timer2').style.color = 'white';
        s2 = 0;
    }
}

function randomString() {
    const turns = ['R', 'L', 'F', 'B', 'U', 'D'];
    const char = [' ', "' ", '2 '];
    let result = '';
    let prior = '';
    let priorIndex = -1;
    let morepriorIndex = -1;
    let currentIndex = -1;
    for (let i = 0; i < 20; i++) {
        currentIndex = Math.round(Math.random() * 5);
        const sign1 = turns[currentIndex];
        if ((i != 0 && prior === sign1) || (!(i < 2) && Math.abs(currentIndex - priorIndex) === 1 && turns[morepriorIndex] === sign1)) {
            i--;
            continue;
        }
        const sign2 = char[Math.round(Math.random() * 2)];
        morepriorIndex = priorIndex;
        priorIndex = currentIndex;
        prior = sign1;
        result += sign1 + sign2;
    }
    document.getElementById('scramble1').innerHTML = result;
    document.getElementById('scramble2').innerHTML = result;
}

function startSpace(event) {
    const timer1 = document.getElementById('timer1');
    if ((!time || time - Date.now() < -500) && (event.keyCode === 32 || media.matches) && (s2 === 1 || running2)) {
        i1++;
        let sec = 0;
        let milisec = 0;
        t1 = setInterval(() => {
            
            milisec += 1;
            if (milisec == 100) {
                sec += 1;
                milisec = 0;
            }
            if (milisec < 10) {
                timer1.innerHTML = `${sec}.0${milisec}`;
            } else {
                timer1.innerHTML = `${sec}.${milisec}`;
            }
        }, 10);
        running1 = !running1;
    }
}

function startEnter(event) {
    if ((!time || time - Date.now() < -500) && (event.keyCode === 13 || media.matches) && (s1 === 1 || running1)) {
        const timer2 = document.getElementById('timer2');
        i2++;
        let sec = 0;
        let milisec = 0;
        t2 = setInterval(() => {
            milisec += 1;
            if (milisec == 100) {
                sec += 1;
                milisec = 0;
            }
            if (milisec < 10) {
                timer2.innerHTML = `${sec}.0${milisec}`;
            } else {
                timer2.innerHTML = `${sec}.${milisec}`;
            }
        }, 10);
        running2 = !running2;
    }
}

function stopSpace(event) {
    if ((event.keyCode === 32 || media.matches) && running1) {
        clearInterval(t1);
        running1 = !running1;
        const data = `record1-${i1}`;
        localStorage.setItem(data, document.getElementById('timer1').innerHTML);
        if (!running1 && !running2) {
            compare();
            randomString();
        }
        time = Date.now();
        addItem('recdisplay', i1, localStorage[data], 1);
    }
}

function stopEnter(event) {
    if ((event.keyCode === 13 || media.matches) && running2) {
        running2 = !running2;
        clearInterval(t2);
        const data = `record2-${i2}`;
        localStorage.setItem(data, document.getElementById('timer2').innerHTML);
        if (!running1 && !running2) {
            compare();
            randomString();
        }
        time = Date.now();
        addItem('recdisplay2', i2, localStorage[data], 2);
    }
}

function compare() {
    const data1 = localStorage[`record1-${i1}`];
    const data2 = localStorage[`record2-${i2}`];
    if (Number(data1) < Number(data2)) {
        document.getElementById('win1').value = num1++;
    } else if (Number(data2) < Number(data1)) {
        document.getElementById('win2').value = num2++;
    } else {
        document.getElementById('draw').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('draw').style.display = 'none';
        }, 2000)
    }
    row++;
    average();
}

function addItem(tableId, num, rec, id) {
    const tableRef = document.getElementById(tableId);
    const newRow = tableRef.insertRow(-1);
    const newCell1 = newRow.insertCell(0);
    const newCell2 = newRow.insertCell(1);
    newCell1.innerHTML = `<div class="sharp${id}">${num}</div>`;
    newCell2.innerHTML = `<div class="rec${id}">${rec}</div>`;
    const elem = document.getElementById(tableId);
    elem.scrollTop = elem.scrollHeight;
}

function removeAll() {
    if (confirm('진짜 다 삭제하시겠습니까?')) {
        localStorage.clear();
        for (let j = 0; j < row; j += 1) {
            document.getElementById('recdisplay').deleteRow(-1);
            document.getElementById('recdisplay2').deleteRow(-1);
        }
        document.getElementById('win1').value = 0;
        document.getElementById('win2').value = 0;
        i1 = 0;
        i2 = 0;
        num1 = 1;
        num2 = 1;
        row = 0;
        randomString();
        document.getElementById('avgtable').innerHTML = `<div id="sesavg">Session Avg : --</div>
        <div id="curavg5">Current Ao5 : --</div>
        <div id="curavg12">Current Ao12 : --</div>
        <div id="bestavg5">best Ao5 : --</div>
        <div id="bestavg12">best Ao12 : --</div>`;
        document.getElementById('avgtable2').innerHTML = `<div id="sesavg-2">Session Avg : --</div>
        <div id="curavg5-2">Current Ao5 : --</div>
        <div id="curavg12-2">Current Ao12 : --</div>
        <div id="bestavg5-2">best Ao5 : --</div>
        <div id="bestavg12-2">best Ao12 : --</div>`;
    }
}

function average() {
    //session avg
    let session1 = document.getElementById('sesavg');
    let session2 = document.getElementById('sesavg-2');

    let sesavg1 = 0;
    let sesavg2 = 0;
    for (let i = 1; i <= row; i++) {
        sesavg1 += Number(localStorage[`record1-${i}`]);
        sesavg2 += Number(localStorage[`record2-${i}`]);
    }
    sesavg1 /= row;
    sesavg2 /= row;
    sesavg1 = sesavg1.toFixed(2);
    sesavg2 = sesavg2.toFixed(2);
    session1.innerHTML = `Session Avg : ${sesavg1}`;
    session2.innerHTML = `Session Avg : ${sesavg2}`;
    if (row >= 12) {
        curAverage(12);
    }
    if (row >= 5) {
        curAverage(5);
    }
}

function curAverage(n) {
    let curavg1 = document.getElementById(`curavg${n}`);
    let curavg2 = document.getElementById(`curavg${n}-2`);
    let curavgVal1 = 0;
    let curavgVal2 = 0;
    let max1 = -1000,
        max2 = -1000;
    let min1 = 1000,
        min2 = 1000;
    for (let i = row, j = 0; j < n; j++, i--) {
        if (Number(localStorage[`record1-${i}`]) > max1) {
            max1 = Number(localStorage[`record1-${i}`]);
        }
        if (Number(localStorage[`record1-${i}`]) < min1) {
            min1 = Number(localStorage[`record1-${i}`]);
        }
        if (Number(localStorage[`record2-${i}`]) > max2) {
            max2 = Number(localStorage[`record2-${i}`]);
        }
        if (Number(localStorage[`record2-${i}`]) < min2) {
            min2 = Number(localStorage[`record2-${i}`]);
        }
    }
    for (let i = row, j = 0; j < n; j++, i--) {
        curavgVal1 += Number(localStorage[`record1-${i}`]);
        curavgVal2 += Number(localStorage[`record2-${i}`]);
    }
    curavgVal1 = (curavgVal1 - min1 - max1) / (n - 2);
    curavgVal2 = (curavgVal2 - min2 - max2) / (n - 2);
    curavgVal1 = curavgVal1.toFixed(2);
    curavgVal2 = curavgVal2.toFixed(2);
    curavg1.innerHTML = `Current Ao${n} : ${curavgVal1}`;
    curavg2.innerHTML = `Current Ao${n} : ${curavgVal2}`;
    if (n === 5) {
        if (curavgVal1 < bestAo5_1) {
            bestAo5_1 = curavgVal1;
            document.getElementById('bestavg5').innerHTML = `best Ao5 : ${bestAo5_1}`;
        }
        if (curavgVal2 < bestAo5_2) {
            bestAo5_2 = curavgVal2;
            document.getElementById('bestavg5-2').innerHTML = `best Ao5 : ${bestAo5_2}`;
        }
    }
    if (n === 12) {
        if (curavgVal1 < bestAo12_1) {
            bestAo12_1 = curavgVal1;
            document.getElementById('bestavg12').innerHTML = `best Ao12 : ${bestAo12_1}`;
        }
        if (curavgVal2 < bestAo12_2) {
            bestAo12_2 = curavgVal2;
            document.getElementById('bestavg12-2').innerHTML = `best Ao12 : ${bestAo12_2}`;
        }
    }
}