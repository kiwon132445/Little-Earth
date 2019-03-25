(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    firebase.database().ref("users/" + user.uid).update(
      {
        "name" : user.displayName,
        "email" : user.email,
        "lifespan" : 50
      }
    );
    document.getElementById("userName").append(user.displayName + "!");
  });
  
})();