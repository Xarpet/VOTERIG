function playLevel5() { 
  document.getElementById("background").style.display = "none";
  document.getElementById("level-indicator").innerText = "Level 5/5: Make the election fair and square, as it should be. Hold an election that accurately represents the actual population distribution.";
  document.getElementById("left-text").innerText = "Congratulations on your successful VOTERIGging thus far! Unfortunately, you have managed to disenfranchize so many Green and Orange party voters that you are being threatened with jailtime. And while you love the purple party, you would not look good in an orange jumpsuit. For this year's election, prove the haters wrong and hold the fairest election possible, with the results accurately reflecting the population distribution "
  document.getElementById("new-fact").innerText = "Research by sociologists Joshua Dyck and James Gimpel demonstrated that increasing the distance from voter to ballot box can increase the likelihood of voting absentee/voting by mail upto 94%. In TX, with over 12% of mailed in ballots being rejected in the most recent election, this can become a silent form of voter suppression.";
  wintext1 = "You held a fair election! Your fairness index is "
  wintext2 = ". You have redeemed yourself."
  const distributions = [
    genRandomPoints({
      densityFunc: cluster(0.75, 0.25, 0.25, 2.0),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.80, 0.55, 0.15, 0.8),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.85, 0.65, 0.10, 0.2),
      partyFunc: () => 'purple'
    }),
    genRandomPoints({
      densityFunc: cluster(0.38, 0.35, 0.25, 0.8),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.55, 0.60, 0.18, 0.5),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.15, 0.80, 0.10, 0.3),
      partyFunc: () => 'orange'
    }),
    genRandomPoints({
      densityFunc: cluster(0.50, 0.10, 0.10, 0.4),
      partyFunc: () => 'green'
    }),
    genRandomPoints({
      densityFunc: cluster(0.32, 0.70, 0.18, 0.5),
      partyFunc: () => 'green'
    }),
    genRandomPoints({
      densityFunc: cluster(0.72, 0.78, 0.12, 0.3),
      partyFunc: () => 'green'
    }),
  ];
                       
  const totalPoints = {'purple': 0, 'green': 0, 'orange': 0};
  for (const {xs, ys, parties} of distributions) {
    for (const party of parties) {
      totalPoints[party] += 1;
    }
  }
  
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
    let percentage = [votes['purple'] / population, votes['green'] / population, votes['orange']]
    let mse = Math.pow(totalPoints['purple'] - percentage[0], 2) + Math.pow(totalPoints['green'] - percentage[1], 2) + Math.pow(totalPoints['orange'] - percentage[2], 2)
    console.log(mse)
    
    if (mse > 0.85) {
      return [true, "⭐⭐⭐", mse, "The Judge, "];
    }
    else if (mse > 0.7) {
      return [true, "⭐⭐", mse, "Morally Compromised"];
    }
    else if (mse >= 0.50) {
      return [true, "⭐", mse, "Cheat Harder!"];
    }
    else {
      return [false, `Your fairness index is only ${Math.floor(mse * 100)}! Try again.`];
    }
  });
}