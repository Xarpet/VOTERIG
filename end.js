function playEnd(){
  document.getElementById("mainframe").remove();
  document.getElementById("end-message").style.display = "flex"
  let title;
  switch(currentScore) {
    case 6:
    case 7:
    case 8:
    case 9:
      title = "Amateur Fraud";
      break;
    case 10:
    case 11:
    case 12:
    case 13:
      title = "Natural Con Artist";
      break;
    case 14:
    case 15:
      title = "Expert Fiddler";
      break;
    case 16:
    case 17:
      title = "Exquisite Gaslighter"
      break;
    case 18:
      title = "...but was it worth it?"
      break;
  }
  const t = (timeTaken) / 1000;
  document.getElementById("scoring").innerText = `You earned a total of ${currentScore} stars\nYour title: ${title}\n Total Time ${t} seconds`
}