import '../styles/style.css';

const levels = {
    1: {
        speed: randomTime(800, 900),
        score: 22,
        time: 23000,
    },
    2: {
        speed: randomTime(700, 800),
        score: 20,
        time: 19000,
    },
    3: {
        speed: randomTime(600, 700),
        score: 18,
        time: 16000,
    },
    4: {
        speed: randomTime(500, 600),
        score: 16,
        time: 13000,
    },
    5: {
        speed: randomTime(450, 500),
        score: 10,
        time: 11000,
    },
}

class Timer {
    constructor() {
        this.gameTimerElement = document.querySelector('.game__timer');
    }

    createTimer() {
        let counter = currentLevelParams.time / 1000;

        this.interval = setInterval(function() {
            counter--;
            levelTimer.innerHTML = `${counter}`;

            if (counter <= 0) {
                clearInterval(this.interval);
                createModal('lose');
            }

            document.querySelector('.game__timer').style.opacity = '1';
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.interval);
    }
}

class Assets {
    constructor() {
        this.menuAudio = new Audio('./audio/menu.mp3');
        this.gameAudio = new Audio('./audio/game.mp3');
        this.winAudio = new Audio('./audio/win.mp3');
        this.loseAudio = new Audio('./audio/lose.mp3');
        this.catchSound = new Audio('./audio/catch.mp3');
    }
}

const assets = new Assets();
const timer = new Timer();

const menu = document.querySelector('.menu');
const game = document.querySelector('.game');
const modalWindow = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalImage = document.querySelector('.modal__img');
const nextLevelBtn = document.querySelector('.next');
const restartGameBtn = document.querySelector('.restart');
const score = document.querySelector('.score');
const level = document.querySelector('.level');
const startGameBtn = document.querySelector('.start-btn');
const boxes = document.querySelectorAll('.box');
const cats = document.querySelectorAll('.cat');
const exitButtons = document.querySelectorAll('.exit');
let levelTimer = document.querySelector('.timer');
let lastBox;
let currentLevel = localStorage.getItem('currentLevelLA') !== null ? Number(localStorage.getItem('currentLevelLA')) : 1;
let isGameRuns = true;
let currentLevelParams = Object.assign({}, levels[currentLevel]);

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomBox(boxes) {
    const index = Math.floor(Math.random() * boxes.length);
    const box = boxes[index];

    if (box === lastBox) {
        return randomBox(boxes);
    }

    lastBox = box;

    return box;
}

function appear(speed) {
    const box = randomBox(boxes);

    box.classList.add('up');

    setTimeout(() => {
        box.classList.remove('up');

        if (isGameRuns) appear(speed);
    }, speed);
}

function startGame() {
    if (!modalWindow.classList.contains('hidden')) {
        modalWindow.classList.add('hidden');
    } else {
        menu.classList.add('hidden');
    }
    game.classList.remove('hidden');
    assets.menuAudio.pause();

    startLevel();

    setTimeout(() => {
        appear(currentLevelParams.speed);
        setTimeout(() => isGameRuns = true, currentLevelParams.time);
        assets.gameAudio.currentTime = 0;
        assets.gameAudio.play();
    }, 900);
}

startGameBtn.addEventListener('click', startGame);

function startLevel() {
    isGameRuns = true;
    level.innerHTML = `${currentLevel}`;
    currentLevelParams = Object.assign({}, levels[currentLevel]);

    for (let i = currentLevelParams.score; i > 0; i--) {
        let scorePaw = document.createElement('img');
        scorePaw.src = './img/paw.png';
        scorePaw.classList.add('score-paw');
        score.append(scorePaw);
    }

    timer.createTimer();
}

function whack(e) {
    if(!e.isTrusted) return;

    assets.catchSound.currentTime = 0;
    assets.catchSound.play();
    score.lastElementChild.remove();
    this.parentNode.classList.remove('up');

    currentLevelParams.score--;

    if (currentLevelParams.score <= 0) {
        createModal('win');
    }
}

function createModal(result) {
    assets.gameAudio.pause();
    timer.stopTimer();

    isGameRuns = false;

    if (result === 'win') {
        modalTitle.innerHTML = 'Good job!';
        modalImage.style.backgroundImage = "url('./img/win-cat.png')";
        restartGameBtn.style.display = 'none';
        nextLevelBtn.style.display = 'block';

        if (currentLevel === Object.keys(levels).length) {
            nextLevelBtn.style.display = 'none';
        }

        modalWindow.classList.remove('hidden');
        assets.winAudio.currentTime = 0;
        assets.winAudio.play();
    } else if (result === 'lose') {
        localStorage.setItem('currentLevelLA', '1');

        modalTitle.innerHTML = 'Try again!';
        modalImage.style.backgroundImage = "url('./img/lose-cat.png')";
        nextLevelBtn.style.display = 'none';
        restartGameBtn.style.display = 'block';

        modalWindow.classList.remove('hidden');
        assets.loseAudio.currentTime = 0;
        assets.loseAudio.play();
    }
}

function exit() {
    currentLevel = 1;
    localStorage.setItem('currentLevelLA', String(currentLevel));

    currentLevelParams = Object.assign({}, levels[currentLevel]);

    if (!modalWindow.classList.contains('hidden')) {
        modalWindow.classList.add('hidden');

        setTimeout( () => {
            nextLevelBtn.style.display = 'block';
            restartGameBtn.style.display = 'block';
        }, 700);
    }

    while (score.children.length > 0) {
        score.lastChild.remove()
    }

    timer.stopTimer();
    assets.gameAudio.pause();
    assets.menuAudio.currentTime = 0;
    assets.menuAudio.play();
    isGameRuns = false;
    game.classList.add('hidden');
    menu.classList.remove('hidden');
}

function changeLevel() {
    currentLevel++;
    localStorage.setItem('currentLevelLA', String(currentLevel));

    timer.stopTimer();
    while (score.children.length > 0) {
        score.lastChild.remove()
    }
    isGameRuns = false;

    startGame();
}

function restartGame() {
    currentLevel = 1;
    localStorage.setItem('currentLevelLA', String(currentLevel));

    timer.stopTimer();
    while (score.children.length > 0) {
        score.lastChild.remove()
    }
    isGameRuns = false;
    startGame();
}

nextLevelBtn.addEventListener('click', changeLevel);

restartGameBtn.addEventListener('click', restartGame);

exitButtons.forEach(btn => btn.addEventListener('click', exit));

cats.forEach(cat => cat.addEventListener('click', whack));
