let canvas;
let submitBtn;
let canvasOverlay;
let ballotTemplate;
const SIZE = 600;
const BALLOT_RADIUS = 90;
const GRIDSIZE = 1E-3;
const BACKGROUND_COLOR = "#2d3436";
const PARTIES = {
  yellow: "#fdcb6e",
  purple: "#a29bfe",
  green: "#00b894",
  grey1: "#a29bfe",
  grey2: "#696969",
  orange: "#e17055"
};

let currentLevel = 0;

function startLevel(distributions, check) {
    const { xs, ys, parties } = combineDistributions(distributions);
  
    const numPoints = parties.length;
    updateTimes = new Array(numPoints).fill(0);
    const origXs = xs.slice();
    const origYs = ys.slice();
    const wobbleFn = () => {
      makeWobble({ xs, ys, origXs, origYs, numPoints });
    };
    let wobbleInterval = setInterval(wobbleFn, 200);
    const velocities = new Array(numPoints).fill(WOBBLE_VELOCITY);
    drawPoints({ xs, ys, parties, velocities });
    const ballotIds = [1, 2, 3];
  
    const ballotElems = new Map();
    for (const bid of ballotIds) {
      createBallot(bid, ballotElems);
    }
    canvasOverlay.ondrop = makeOnDrop(ballotElems);
    submitBtn.onclick = () => {
      const stationXs = [];
      const stationYs = [];
      for (const bid of ballotIds) {
        const elem = ballotElems.get(bid);
        const xPos = (elem.offsetLeft + BALLOT_RADIUS) / SIZE;
        const yPos = (elem.offsetTop + BALLOT_RADIUS) / SIZE;
        if (xPos > 1 || xPos < 0 || yPos > 1 || yPos < 0) {
          alert("please place the ballots within the map boundary");
          return;
        }
        stationXs.push(xPos);
        stationYs.push(yPos);
      }
  
      const { votes, stationIndices } = computeVoteResults({ xs: origXs, ys: origYs, parties, stationXs, stationYs });
      
      clearInterval(wobbleInterval);
      
      const [won, text, percentage, name] = check({
        votes,
        stationXs,
        stationYs,
      });
      
      if (won) {
        animateToStations({
          xs, ys, velocities, stationXs, stationYs, stationIndices
        });
        
        setTimeout(() => {
          // destroy the ballots as we'll be creating new ones next level
          for (const bid of ballotIds) {
            destroyBallot(bid, ballotElems);
          }
  
          let popup = document.getElementById('light')
          popup.style.display = 'block';
  
          stars = document.createElement("span");
          stars.className = "stars"
          stars.innerText = text + "\n" + name + "\n"
          popup.insertBefore(stars, popup.children[1])
  
          textbox = document.getElementById("win-text")
          textbox.innerText = "Good job! Purple won with " + Math.round(percentage * 100) + "% of the vote. \n"
          document.getElementById('fade').style.display = 'block';
        }, 500);
      }
      else {
        animateToStations({
          xs, ys, velocities, stationXs, stationYs, stationIndices
        });
        setTimeout(() => {
          alert(text);
          for (let i = 0; i < numPoints; i++) {
            xs[i] = origXs[i];
            ys[i] = origYs[i];
            if (stationIndices[i] == -1) {
              velocities[i] = WOBBLE_VELOCITY;
            }
          }
          setTimeout(() => {
            velocities.fill(WOBBLE_VELOCITY);
            wobbleInterval = setInterval(wobbleFn, 200);
          }, 500);
        }, 500);
      }
    }
}


function closePopup() {
  let popup = document.getElementById('light')
  popup.style.display = 'none';
  document.getElementById('fade').style.display = 'none';

  popup.removeChild(popup.children[1])

  if (currentLevel != 5) {
    currentLevel += 1;
    playLevel(currentLevel);
  }
}

function playLevel(levelNumber) {
  switch (levelNumber) {
    case 0: return playLevel0();
    case 1: return playLevel1();
    case 2: return playLevel2();
    case 3: return playLevel3();
    case 4: return playLevel4();
  }
}


const WOBBLE_VELOCITY = 2E-2;
function makeWobble({ xs, ys, origXs, origYs, numPoints }) {
  for (let i = 0; i < numPoints; i++) {
    if (Math.random() < 0.2) {
      xs[i] = origXs[i] + (Math.random() - 0.5) * 0.05;
      ys[i] = origYs[i] + (Math.random() - 0.5) * 0.05;
    }
  }
}

function drawPoints({ xs, ys, parties, velocities }) {
  const w = canvas.width;
  const h = canvas.height;

  const numPoints = xs.length;
  let [currentXs, currentYs] = [xs.slice(), ys.slice()];

  let stopped = false

  let previousTime;
  function frame(timeStamp) {
    const timeStep = timeStamp - (previousTime ?? timeStamp);


    const ctx = canvas.getContext("2d");
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < numPoints; i++) {
      const cx = currentXs[i];
      const cy = currentYs[i];
      const dx = xs[i] - cx;
      const dy = ys[i] - cy;
      const mag = Math.sqrt(dx * dx + dy * dy);
      const vel = velocities[i];
      if (mag > 1E-10 && timeStep < 100) {
        currentXs[i] += (dx / mag) * 1E-3 * vel * timeStep;
        currentYs[i] += (dy / mag) * 1E-3 * vel * timeStep;
      }

      ctx.fillStyle = PARTIES[parties[i]];
      ctx.beginPath();
      ctx.arc(currentXs[i] * w, currentYs[i] * h, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    previousTime = timeStamp;
    if (!stopped) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return () => {
    stopped = true;
  };
}

function genRandomPoints({ densityFunc, partyFunc }) {
  const xs = [];
  const ys = [];
  const parties = [];
  for (let x = 0.0; x <= 1.0; x += GRIDSIZE) {
    for (let y = 0.0; y <= 1.0; y += GRIDSIZE) {
      if (densityFunc(x, y)) {
        xs.push(x);
        ys.push(y);
        parties.push(partyFunc(x, y));
      }
    }
  }
  return { xs, ys, parties };
}

function cluster(cx, cy, radius, multiplier) {
  return (ix, iy) => {
    const x = (ix - cx) / radius;
    const y = (iy - cy) / radius;
    distance = Math.sqrt(x * x + y * y);
    return (Math.random() < (1E4 / Math.pow(1 + distance, 12)) * multiplier * GRIDSIZE * GRIDSIZE / (radius * radius));
  }
}

function combineDistributions(distributions) {
  let results = [];
  for (const { xs, ys, parties } of distributions) {
    let index = 0;
    while (index < xs.length) {
      results.push({ x: xs[index], y: ys[index], p: parties[index] });
      index++;
    }
  }
  let shuffled = shuffleArray(results);
  return {
    xs: shuffled.map(s => s.x),
    ys: shuffled.map(s => s.y),
    parties: shuffled.map(s => s.p),
  };
}

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => b.sort)
    .map(({ value }) => value);
}

function createBallot(ballotId, ballotElems) {
  const elem = ballotTemplate.content.cloneNode(true).querySelector(".ballot");
  elem.style.top = `${180 * (ballotId - 1)}px`;
  elem.style.right = "0px";
  elem.ondragstart = (ev) => {
    dragStart(ballotId, ev);
  };
  canvasOverlay.appendChild(elem);
  ballotElems.set(ballotId, elem);
}
function destroyBallot(ballotId, ballotElems) {
  const elem = ballotElems.get(ballotId);
  elem.remove();
  ballotElems.delete(ballotId);
}

// drag and drop stuff

function dragStart(ballotId, event) {
  const offsetX = event.target.offsetLeft - event.clientX;
  const offsetY = event.target.offsetTop - event.clientY;
  const toTransfer = JSON.stringify({
    offsetX,
    offsetY,
    ballotId
  });
  event.dataTransfer.setData("text/plain", toTransfer);
  console.log(event);
  event.dataTransfer.setDragImage(document.getElementById("drag-thumbnail"), event.layerX, event.layerY);
}

function makeOnDrop(ballotElems, minSeparation = 0) {
  return (event) => {
    event.preventDefault();
    const s = event.dataTransfer.getData("text/plain");
    let { offsetX, offsetY, ballotId } = JSON.parse(s);
    const dm = ballotElems.get(ballotId);
    const posX = event.clientX + parseInt(offsetX, 10);
    const posY = event.clientY + parseInt(offsetY, 10);
    dm.style.left = `${posX}px`;
    dm.style.top = `${posY}px`;
    return false;
  }
}

// drag and drop stuff ends

function distanceSquared(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return (dx * dx + dy * dy)
}
const VOTING_TRESHOLD = 0.15;
function computeVoteResults({ xs, ys, parties, stationXs, stationYs }) {
  const votes = {};
  const stationIndices = [];
  for (const party of parties) {
    votes[party] = 0;
  }
  const totalPeople = xs.length;
  const totalStations = stationXs.length;
  for (let i = 0; i < totalPeople; i++) {
    let selectedStation = -1;
    for (let j = 0; j < totalStations; j++) {
      const dist = Math.sqrt(distanceSquared(xs[i], ys[i], stationXs[j], stationYs[j]));
      if (dist < VOTING_TRESHOLD) {
        selectedStation = j;
        votes[parties[i]] += 1;
        break;
      }
    }
    stationIndices.push(selectedStation);
  }
  return { votes, stationIndices };
}
function animateToStations({ xs, ys, velocities, stationXs, stationYs, stationIndices }) {
  for (let i = 0; i < stationIndices.length; i++) {
    const sta = stationIndices[i];
    xs[i] = stationXs[sta];
    ys[i] = stationYs[sta];
    velocities[i] = 0.25;
  }
}

window.addEventListener("load", () => {
  canvas = document.getElementById("game-canvas");
  submitBtn = document.getElementById("submit-btn");
  ballotTemplate = document.getElementById("ballot-template");
  canvasOverlay = document.getElementById("canvas-overlay");
  canvasOverlay.ondragover = (ev) => ev.preventDefault();
  playLevel0();
});