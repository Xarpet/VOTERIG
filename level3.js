function playLevel3() {
  document.getElementById("level-indicator").innerText = "Level 3/5: Get 50% votes to win. No polling place consolidation.";
    document.getElementById("new-fact").innerText = "Research by sociologists Joshua Dyck and James Gimpel demonstrated that increasing the distance from voter to ballot box can increase the likelihood of voting absentee/voting by mail upto 94%. In TX, with over 12% of mailed in ballots being rejected in the most recent election, this can become a silent form of voter suppression.";
  const distributions = [];
  distributions.push(genRandomPoints({
    densityFunc: cluster(0.5, 0.4, 0.1, 0.75),
    partyFunc: () => Math.random() > 0.9 ? 'green' : 'purple'
  }));
  distributions.push(genRandomPoints({
    densityFunc: cluster(0.5, 0.5, 1.75, 7.5, 16),
    partyFunc: () => Math.random() > 0.1 ? 'green' : 'purple'
  }));
  startLevel(distributions, ({votes, stationXs, stationYs}) => {
    const numStations = stationXs.length;
    for (let i = 0; i < numStations; i++) {
      for (let j = i + 1; j < numStations; j++) {
        const dist = Math.sqrt(Math.pow((stationXs[i] - stationXs[j]),2) + Math.pow((stationYs[i] - stationYs[j]),2));
        if (dist < 0.30) {
            return [false, "The ballots are placed too close!"]
        }
      }
    }
    let percentage = votes['purple'] / (votes['green'] + votes['purple']);
    if (percentage > 0.85) {
      return [true, "⭐⭐⭐", percentage, "Master Manipulator!"];
    }
    else if (percentage > 0.7) {
      return [true, "⭐⭐", percentage, "Morally Compromised"];
    }
    else if (percentage >= 0.50) {
      return [true, "⭐", percentage, "Slim Victory!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}