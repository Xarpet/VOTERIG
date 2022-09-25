function playLevel5() { 
  document.getElementById("background").style.display = "none";
  document.getElementById("level-indicator").innerText = "Level 5/5: Make the election fair and square, as it should be. Hold an election that accurately represents the actual population distribution.";
  document.getElementById("left-text").innerText = "Congratulations on your successful VOTERIGging thus far! Unfortunately, you have managed to disenfranchize so many Green and Orange party voters that you are being threatened with jailtime. And while you love the purple party, you would not look good in an orange jumpsuit. For this year's election, prove the haters wrong and hold the fairest election possible, with the results accurately reflecting the population distribution "
  document.getElementById("new-fact").innerText = "Ever since 18 year olds were given the right to vote in 1972, they have been largely underrepresented in polls. Young adults make up a considerable portion of Americans who are eligible to vote, and yet only half of voters age 18-25 showed up to vote during the consequential 2016 presidential election. ";
  wintext1 = "You held a fair election! Your fairness index is "
  wintext2 = ". You have redeemed yourself."
  const distributions = [
    genRandomPoints({
      densityFunc: cluster(0.75, 0.25, 0.50, 2.0),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.80, 0.55, 0.30, 0.8),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.85, 0.65, 0.20, 0.2),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.38, 0.35, 0.50, 0.8),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.55, 0.60, 0.35, 0.5),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.15, 0.80, 0.20, 0.3),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.50, 0.10, 0.20, 0.4),
      partyFunc: () => 'green'
    }),
    genRandomPoints({
      densityFunc: cluster(0.32, 0.70, 0.35, 0.5),
      partyFunc: () => 'green'
    }),
    genRandomPoints({
      densityFunc: cluster(0.72, 0.78, 0.25, 0.3),
      partyFunc: () => 'green'
    }),
  ];
  
  const totalPoints = {'purple': 0, 'green': 0, 'orange': 0};
  for (const {xs, ys, parties} of distributions) {
    for (const party of parties) {
      totalPoints[party] += 1;
    }
  }
  let total = totalPoints['purple'] + totalPoints['green'] + totalPoints['orange']
  
  startLevel(distributions, ({votes, stationXs, stationYs}) => {
    const numStations = stationXs.length;
    for (let i = 0; i < numStations; i++) {
      for (let j = i + 1; j < numStations; j++) {
        const dist = Math.sqrt(Math.pow((stationXs[i] - stationXs[j]),2) + Math.pow((stationYs[i] - stationYs[j]),2));
        if (dist < 0.30) {
            return [false, "The ballot boxes are placed too close together!"]
        }
      }
    }
    let population = votes['purple'] + votes['green'] + votes['orange']
    let percentage = {
      purple: votes['purple'] / population,
      green: votes['green'] / population,
      orange: votes['orange'] / population,
    };
    const c = {
      purple: totalPoints['purple'] / total,
      orange: totalPoints['orange'] / total,
      green: totalPoints['green'] / total,
    };
    let mse = 1 - (
      Math.abs(c.green - percentage.green)/c.green + Math.abs(c.purple - percentage.purple)/c.purple + Math.abs(totalPoints['orange']/total - percentage.orange)/c.orange) / 3;
    const comparison = `The population consists ${Math.round(100*c.purple)}% purple, ${Math.round(100*c.green)}% green, ${Math.round(100*c.orange)}% orange. The election results are ${Math.round(100*percentage.purple)}% purple, ${Math.round(100*percentage.green)}% green, ${Math.round(100*percentage.orange)}% orange.`;
    if (mse > 0.85) {
      currentScore += 3;
      return [true, "⭐⭐⭐", mse, "The Noble Judge. \n" + comparison];
    }
    else if (mse > 0.7) {
      currentScore += 2;
      return [true, "⭐⭐", mse, "A Moral Victory. \n" + comparison];
    }
    else if (mse > 0.6) {
      currentScore += 1;
      return [true, "⭐", mse, "Fair Enough. \n" + comparison];
    }
    else {
      return [false, `Your fairness index is only ${Math.floor(mse * 100)}! Try again.` + comparison];
    }
  });
}