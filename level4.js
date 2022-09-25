function playLevel4() {
document.getElementById("background").style.display = "block" 
  document.getElementById("level-indicator").innerText = "Level 4/5: Get 50% votes to win. No polling place consolidation. You're no longer politically omniscient.";
    document.getElementById("new-fact").innerText = "Polling place consolidation is a common tactic to subtly disenfranchise low income voters and voters of color by making them wait in line for exceedingly long times at the single available polling place in their neighborhoods. This coupled with new laws, such as Georgia's ban on providing water to voters waiting in line discourage these groups of people from showing up to vote";
  document.getElementById("left-text").innerText = "In the real world, people aren't colored dots! You might not be able to see where your voter base clusters so easily anymore, but you can INFER their preferred locations based on your Purple Party platform...this year, the Purple Party adopted a platform highlighting the following ideals: \n \n Eliminating govt funding for reproductive healthcare \n \n Reducing property taxes \n \n Reducing urban sprawl into agricultural land \n \n Keeping recreational marijuana criminalized"
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
      partyFunc: () => (Math.random() > 0.9) ? 'grey1' : 'grey2',
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
      partyFunc: () => (Math.random() > 0.5) ? 'grey1' : 'grey2',
    }),
    genRandomPoints({
      densityFunc: cluster(0.9, 0.9, 0.3, 0.2),
      partyFunc: () => (Math.random() > 0.9) ? 'grey1' : 'grey2',
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
    if (percentage > 0.8) {
      currentScore += 3;
      return [true, "⭐⭐⭐", percentage, "Master Manipulator!"];
    }
    else if (percentage > 0.7) {
      currentScore += 2;
      return [true, "⭐⭐", percentage, "Morally Compromised"];
    }
    else if (percentage >= 0.50) {
      currentScore += 1;
      return [true, "⭐", percentage, "Slim Victory!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}