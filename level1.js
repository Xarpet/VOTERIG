function playLevel1() {
  document.getElementById("level-indicator").innerText = "Level 1/5: Get 50% votes to win.";
    document.getElementById("left-text").innerText = "The last level considered a situation where the town's population was 50% purple voters and 50% green voters. But what if green voters were the majority in this town? Select your polling locations carefully, making use of polling place consolidation to pull off an underdog victory for the Purple party!"
  document.getElementById("new-fact").innerText = `A study conducted by the Stanford Graduate School of Business led by S Christian Wheeler concluded that “the influence of polling location on voting found in [their] research would be more than enough to change the outcome of a close election.” `;
  const distributions = [];
  for (let i = 0.3; i <= 0.7; i += 0.1) {
    for (let j = 0.3; j <= 0.7; j += 0.1) {
      if (!(i==0.7 && j==0.4)) {
        distributions.push(genRandomPoints({
          densityFunc: cluster(i, j, 0.15, 0.15),
          partyFunc: () => 'green'
        }));
      }
    }
  }
  distributions.push(genRandomPoints({
    densityFunc: cluster(0.74, 0.4, 0.15, 0.15),
    partyFunc: () => 'purple'
  }));
  distributions.push(genRandomPoints({
    densityFunc: cluster(0.5, 0.5, 4.0, 1.5),
    partyFunc: () => Math.random() > 0.4 ? 'green' : 'purple'
  }));
  distributions.push(genRandomPoints({
    densityFunc: cluster(0.5, 0.5, 4.0, 0.5),
    partyFunc: () => 'orange'
  }));
  startLevel(distributions, ({ votes, stationXs, stationYs }) => {
    console.log("iojafiwoejf");
    let percentage = votes['purple'] / (votes['green'] + votes['purple'] + votes['orange']);
    if (percentage > 0.85) {
      return [true, "⭐⭐⭐", percentage, "Master Manipulator"];
    }
    else if (percentage > 0.7) {
      return [true, "⭐⭐", percentage, "Morally Compromised!"];
    }
    else if (percentage >= 0.50) {
      return [true, "⭐", percentage, "Cheat Harder!"];
    }
    else {
      return [false, `Your party only got ${Math.floor(percentage * 100)}%! Try again.`];
    }
  });
}