var lifespanDecreaseId;

const startScoreValues =
{
  "lifespan": 50,
  "experience": 0
};

//to start the game
function start() {
  writeScoresfromDbToLocalStorage();
  startLifespanDecrease();
}

function restartGame() {
  resetScores();
  start();
}

// Returns a promise when updates are complete.
function decreaseLifespan(amount = 1) {
  let promise;
  let currentPercents = getLifespan();
  if ((currentPercents - amount) <= 0) {
    //Game over!
    promise = writeLifespanToDB(0);
  } else {
    promise = writeLifespanToDB(currentPercents - amount);
  }
  return promise;
}

// Returns a promise when updates are complete.
function increaseLifespan(amount = 25) {
  let promise;
  let currentPercents = getLifespan();
  if ((currentPercents + amount) > 100) {
    promise = writeLifespanToDB(100);
  } else {
    promise = writeLifespanToDB(currentPercents + amount);
  }
  return promise;
}

// Returns a promise when updates are complete.
function increaseExperience(amount = 10) {
  let promise;
  let currentPercents = getExperience();
  if ((currentPercents + amount) >= 100) {
    promise = writeExperienceToDB(100);
  } else {
    promise = writeExperienceToDB(currentPercents + amount);
  }
  return promise;
}

// Returns a promise when updates are complete.
function resetScores() {
  return writeToDB(startScoreValues);
}

//********TIMER***********************************/

function startLifespanDecrease() {
  lifespanDecreaseId = setInterval(decreaseLifespan, 1000); //1% in 1sec;
}

function stopLifespanDecrease() {
  clearInterval(lifespanDecreaseId);
}

//********LOCAL STORAGE***********************************/

//Returns lifespan as int from localStorage
function getLifespan() {
  return parseInt(localStorage.getItem("lifespan"));
}

//Returns experience as int from localStorage
function getExperience() {
  return parseInt(localStorage.getItem("experience"));
}

//Returns user name from localStorage
function getUserName() {
  return localStorage.getItem("name");
}

function updateLocalStorageLifespan(percents) {
  localStorage.setItem("lifespan", percents);
}

function updateLocalStorageExperience(percents) {
  localStorage.setItem("experience", percents);
}

//********DATABASE***********************************/

// Creates new user.
function initializeUser(callback) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userRef = firebase.database().ref("users").child(user.uid);

      var onUpdatesComplete = userRef.once("value", function (snap) {
        let userData = snap.val();

        if (userData === null) {
          userData = {
            "name": user.displayName,
            "email": user.email,
            "lifespan": 50,
            "experience": 0
          }
          userRef.update(userData);
        }
        localStorage.setItem("name", user.displayName);
      });

      onUpdatesComplete.then(callback);
    }
  });
}

function subscribeForDbLifespanChange(onLifeSpanChange) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var currentUid = user.uid;

      var dbRef = firebase.database().ref().child("users/" + currentUid + "/lifespan");
      dbRef.on(
        'value',
        function (snapshot) {
          onLifeSpanChange(snapshot.val())
        });
    }
  });
}

function subscribeForDbExperienceChange(onExperienceChange) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var currentUid = user.uid;

      var dbRef = firebase.database().ref().child("users/" + currentUid + "/experience");
      dbRef.on(
        'value',
        function (snapshot) {
          onExperienceChange(snapshot.val())
        });
    }
  });
}

// Takes lifespan and experience scores from db and writes to local storage.
function writeScoresfromDbToLocalStorage() {
  subscribeForDbLifespanChange(updateLocalStorageLifespan);
  subscribeForDbExperienceChange(updateLocalStorageExperience);
}

// Parameter updatesForCurrentUser accepts an object, with key-value pairs,
// where key is a key in DB under "users/userUID" node, 
// and value - the new value to write.
// Returns a promise when updates are complete.
function writeToDB(updatesForCurrentUser) {
  let onUpdatesComplete = new Promise(function(resolve, reject){

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
       firebase.database().ref("users/" + user.uid).update(updatesForCurrentUser, resolve);
      }
    });

  });
  return onUpdatesComplete;
}

// Returns a promise when updates are complete.
function writeLifespanToDB(percents) {
  return writeToDB({ "lifespan": percents });
}

// Returns a promise when updates are complete.
function writeExperienceToDB(percents) {
  return writeToDB({ "experience": percents });
}

