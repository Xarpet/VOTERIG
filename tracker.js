function updateStarsLabel() {
  document.getElementById("stars-label").innerText = `${currentScore}`;
}
let lastTimeSnap = Date.now();
let timeTaken = 0;
let timerInterval;
function stopTimer() {
  if (timerInterval !== undefined) {
    clearInterval(timerInterval);
    timerInterval = undefined;
    const now = Date.now();
    timeTaken += now - lastTimeSnap;
    
  }
  
}
function startTimer() {
  const now = Date.now();
  lastTimeSnap = now;
  const elem = document.getElementById("time-label");
  timerInterval = setInterval(() => {
    const t = (timeTaken + Date.now() - lastTimeSnap) / 1000;
    elem.innerText = `${Math.floor(t)}.${Math.floor((t*100)%100)}`;
  }, 60);
  
}