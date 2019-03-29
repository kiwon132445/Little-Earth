
const startScoreValues =
{
  "lifespan": 50,
  "experience": 0
};

function initializeUser() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userRef = firebase.database().ref("users").child(user.uid);
      var promise = userRef.once("value", function (snap) {
        if (snap.val() === null) {
          userRef.update({
            "name": user.displayName,
            "email": user.email,
            "lifespan": 50,
            "experience": 0
          });
        }
      });
      promise.then(function () {
        document.getElementById("userName").append(user.displayName + "!");
      });
    }
  });
}

function restartGame() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userRef = firebase.database().ref("users").child(user.uid);
      userRef.once("value", function (snap) {
        userRef.update(startScoreValues);
      }).then(startLifespanDecrease);
    }
  });
}

initializeUser();