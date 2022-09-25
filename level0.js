function playLevel0() {
  document.getElementById("level-indicator").innerText = "Intro Level (0/5): Get 50% votes to win.";
   document.getElementById("level-indicator").style.color='#f0e7e3';
  document.getElementById("level-indicator").style.fontSize='27px';
  startLevel([
    genRandomPoints({
      densityFunc: cluster(0.5, 0.5, 4.0, 3.0),
      partyFunc: () => (Math.random() > 0.5) ? 'green' : 'purple',
    }),
    genRandomPoints({
      densityFunc: cluster(0.2, 0.2, 0.3, 1.0),
      partyFunc: () => (Math.random() > 0.9) ? 'green' : 'purple',
    }),
    genRandomPoints({
      densityFunc: cluster(0.2, 0.8, 0.3, 1.0),
      partyFunc: () => (Math.random() > 0.1) ? 'green' : 'purple',
    }),
  ], ({votes, stationXs, stationYs}) => {
    let percentage = votes['purple'] / (votes['green'] + votes['purple']);
    if (percentage > 0.85) {
      currentScore += 3;
      return [true, "⭐⭐⭐", percentage, "Master Manipulator!"];
    }
    else if (percentage > 0.7) {
      currentScore += 2;
      return [true, "⭐⭐", percentage, "Cheat Harder! You can make 85%!"];
    }
    else if (percentage >= 0.50) {
      currentScore += 1;
      return [true, "⭐", percentage, "Cheat Harder!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}