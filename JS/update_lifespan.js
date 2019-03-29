const lifespan = document.getElementById("lifespan");
var lifespanDecreaseId;

(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var currentUid = user.uid;

      var dbRef = firebase.database().ref().child("users/" + currentUid + "/lifespan");
      dbRef.on(
        'value',
        function (snapshot) {
          displayLifespan(snapshot.val());
        });
      startLifespanDecrease();
    }
  });
})();

function startLifespanDecrease() {
  lifespanDecreaseId = setInterval(decreaseLifespanBar, 1000); //1% in 1sec;
}

function stopLifespanDecrease() {
  clearInterval(lifespanDecreaseId);
}

function displayLifespan(width) {

  if (width > 97) {
    lifespan.style.borderRadius = '20px';
  }
  lifespan.style.width = width + '%';

  var lifespanText = document.getElementById("lifespanText");
  lifespanText.innerHTML = width + ',000 years';
}

function getCurrentLifespanWidth(){
  return parseInt(lifespan.style.width.split("%")[0]);
}

function decreaseLifespanBar(amount = 1) {
  let currentWidth = getCurrentLifespanWidth();
  if ((currentWidth - amount) <= 0) {
    //Game over!
    writeLifespanToDB(0);
    endGame(false);
  } else {
    writeLifespanToDB(currentWidth - amount);
  }
}

function increaseLifespanBar(amount = 25) {
  let currentWidth = getCurrentLifespanWidth();
  if ((currentWidth + amount) > 100) {
    writeLifespanToDB(100);
  } else {
    writeLifespanToDB(currentWidth + amount);
  }
}

function endGame(didWin) {
  stopLifespanDecrease();
  if (didWin) {
    displayWinScreen();
  } else {
    displayLoseScreen();
  }
}

function displayWinScreen() {
  console.log("You won!");
}

function displayLoseScreen() {
  console.log("You lost!");
}

function writeLifespanToDB(width) {
  writeToDB({ "lifespan": width });
}

// Parameter updatesForCurrentUser accepts an object, with key-value pairs,
// where key is a key in DB under "users/userUID" node, 
// and value - the new value to write.
function writeToDB(updatesForCurrentUser) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.database().ref("users/" + user.uid).update(updatesForCurrentUser);
    }
  });
}