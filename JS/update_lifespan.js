(function(){
  function changeLifespan(width) {

    var lifespan = document.getElementById("lifespan");
    if (width > 97) {
      lifespan.style.borderRadius = '20px';
    }
    lifespan.style.width = width + '%';

    var lifespanText = document.getElementById("lifespanText");
    lifespanText.innerHTML = width + ',000 years';
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        var currentUid = user.uid;
        console.log(currentUid);

        var dbRef = firebase.database().ref().child("users/" + currentUid + "/lifespan"); 
        dbRef.on(
          'value',
          function(snapshot) {
          changeLifespan(snapshot.val());
        });
    }
  });
  

})();