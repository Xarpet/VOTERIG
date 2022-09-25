function playLevel0() {
  document.getElementById("level-indicator").innerText = "Intro Level (0/5): Get 50% votes to win.";
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
      return [true, "⭐⭐⭐", percentage, "Master Manipulator"];
    }
    else if (percentage > 0.7) {
      return [true, "⭐⭐", percentage, "Morally Compromised"];
    }
    else if (percentage >= 0.50) {
      return [true, "⭐", percentage, "Cheat Harder!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}