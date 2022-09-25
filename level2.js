function playLevel2() {
  document.getElementById("level-indicator").innerText = "Level 2/5: Get 50% to win. The scopes of the polling locations must not overlap.";
    document.getElementById("left-text").innerText = "Your attempts at election manipulation are getting a little obvious...a new law has been put into place to fight against polling place consolidation and a considerable number of people have become tired of the two-party system and joined the radical new orange party. Now, no 2 polling places can be within 1 mile of each other (the radius around the ballot box). But that's not stopping you from bringing the Purple party to a sure victory!"
    document.getElementById("new-fact").innerText = "Research by sociologists Joshua Dyck and James Gimpel demonstrated that increasing the distance from voter to ballot box can increase the likelihood of voting absentee/voting by mail upto 94%. In TX, with over 12% of mailed in ballots being rejected in the most recent election, this can become a silent form of voter suppression.";
  const distributions = [];
  for (let i = 0.1; i <= 0.4; i += 0.1) {
    for (let j = 0.1; j <= 0.4; j += 0.1) {
      distributions.push(genRandomPoints({
        densityFunc: cluster(i, j, 0.1, 0.1),
        partyFunc: () => Math.round((i + j) / 0.1) % 2 == 0 ? 'green' : 'purple'
      }));
    }
  }
  distributions.push(genRandomPoints({
        densityFunc: cluster(0.5, 0.5, 4.0, 3.0),
        partyFunc: () => Math.random() > 0.3 ? 'green' : 'purple'
      }));
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
    let percentage = votes['purple'] / (votes['green'] + votes['purple']);
    if (percentage > 0.65) {
      currentScore += 3;
      return [true, "⭐⭐⭐", percentage, "Master Manipulator!"];
    }
    else if (percentage > 0.6) {
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