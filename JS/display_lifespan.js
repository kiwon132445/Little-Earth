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