/**
 * This file holds all the functions that are needed to implement game logic.
 * It is page independent and can be used on different pages.
 */

var lifespanDecreaseId;

const startScoreValues =
{
  "lifespan": 50,
  "experience": 0
};

//To start the game.
function start() {
  writeScoresfromDbToLocalStorage();
  startLifespanDecrease();
}

//To restart the game.
function restartGame() {
  stopLifespanDecrease();
  resetScores();
  start();
}

//Decreases the lifespan and writes the changes to db.
//Returns a promise when updates are complete.
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

//Increases the lifespan and writes the changes to db.
//Returns a promise when updates are complete.
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

//Increases the experience and writes the changes to db.
//Returns a promise when updates are complete.
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

//Resets scores to the default values. Lifespan - 50, experience - 0.
//Returns a promise when updates are complete.
function resetScores() {
  return writeToDB(startScoreValues);
}

//********TIMER***********************************/

//Starts countdown.
//1% in 1sec;
function startLifespanDecrease() {
  lifespanDecreaseId = setInterval(decreaseLifespan, 1000); //1% in 1sec;
}

//Stops countdown.
function stopLifespanDecrease() {
  clearInterval(lifespanDecreaseId);
}

//********LOCAL STORAGE***********************************/

//Returns lifespan as int from localStorage.
function getLifespan() {
  return parseInt(localStorage.getItem("lifespan"));
}

//Returns experience as int from localStorage.
function getExperience() {
  return parseInt(localStorage.getItem("experience"));
}

//Returns user name from localStorage.
function getUserName() {
  return localStorage.getItem("name");
}

//Sets a lifespan value to local storage.
function updateLocalStorageLifespan(percents) {
  localStorage.setItem("lifespan", percents);
}

//Sets an experience value to local storage.
function updateLocalStorageExperience(percents) {
  localStorage.setItem("experience", percents);
}

//********DATABASE***********************************/

// Creates new user if it doesn't exist.
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

//Subscribes for changes of lifespan value.
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

//Subscribes for changes of experience value.
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

//Takes lifespan and experience scores from db and writes to local storage.
function writeScoresfromDbToLocalStorage() {
  subscribeForDbLifespanChange(updateLocalStorageLifespan);
  subscribeForDbExperienceChange(updateLocalStorageExperience);
}

//Parameter updatesForCurrentUser accepts an object, with key-value pairs,
//where key is a key in DB under "users/userUID" node, 
//and value - the new value to write.
//Returns a promise when updates are complete.
function writeToDB(updatesForCurrentUser) {
  let onUpdatesComplete = new Promise(function (resolve, reject) {

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref("users/" + user.uid).update(updatesForCurrentUser, resolve);
      }
    });

  });
  return onUpdatesComplete;
}

//Writes lifespan value to the db.
//Returns a promise when updates are complete.
function writeLifespanToDB(percents) {
  return writeToDB({ "lifespan": percents });
}

//Writes experience value to the db.
//Returns a promise when updates are complete.
function writeExperienceToDB(percents) {
  return writeToDB({ "experience": percents });
}

