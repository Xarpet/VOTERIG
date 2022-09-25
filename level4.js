function playLevel4() {
  document.getElementById("level-indicator").innerText = "Level 4/5: Get 50% votes to win. Ballots must not overlap. You're no longer politically omniscient.";
  document.getElementById("left-text").innerText = "In the real world, people aren't colored dots! You might not be able to see where your voter base clusters so easily anymore, but you can INFER their preferred locations based on your Purple Party platform...this year, the Purple Party adopted a platform highlighting the following ideals: govt funding for reproductive healthcare, reducing property taxes, reducing urban sprawl into agricultural land, keeping recreational marijuana criminalized"
  startLevel([
    genRandomPoints({
      densityFunc: cluster(0.5, 0.5, 4.0, 1.0),
      partyFunc: () => (Math.random() > 0.5) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.2, 0.2, 0.3, 0.2),
      partyFunc: () => (Math.random() > 0.9) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.2, 0.8, 0.2, 0.2),
      partyFunc: () => (Math.random() > 0.1) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.1, 0.3, 0.1, 0.3),
      partyFunc: () => (Math.random() > 0.9) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.4, 0.4, 0.3, 0.2),
      partyFunc: () => (Math.random() > 0.1) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.7, 0.8, 0.2, 0.25),
      partyFunc: () => (Math.random() > 0.1) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.9, 0.2, 0.3, 0.2),
      partyFunc: () => (Math.random() > 0.1) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.8, 0.5, 0.2, 0.3),
      partyFunc: () => (Math.random() > 0.9) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.9, 0.9, 0.3, 0.2),
      partyFunc: () => (Math.random() > 0.1) ? 'grey1' : 'grey2',
    })
  ], ({votes, stationXs, stationYs}) => {
    const numStations = stationXs.length;
    for (let i = 0; i < numStations; i++) {
      for (let j = i + 1; j < numStations; j++) {
        const dist = Math.sqrt(Math.pow((stationXs[i] - stationXs[j]),2) + Math.pow((stationYs[i] - stationYs[j]),2));
        if (dist < 0.30) {
            return [false, "The ballots are placed too close!"]
        }
      }
    }
    let percentage = votes['grey1'] / (votes['grey1'] + votes['grey2']);
    if (percentage > 0.85) {
      return [true, "⭐⭐⭐", percentage, "Master Manipulator"];
    }
    else if (percentage > 0.7) {
      return [true, "⭐⭐", percentage, "Morally Compromised"];
    }
    else if (percentage > 0.51) {
      return [true, "⭐", percentage, "Cheat Harder!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}