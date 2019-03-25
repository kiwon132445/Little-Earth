(function(){
  
  const lifespan = document.getElementById("lifespan");
  var lifespanDecreaseId;
  
  function displayLifespan(width) {

    if (width > 97) {
      lifespan.style.borderRadius = '20px';
    }
    lifespan.style.width = width + '%';

    var lifespanText = document.getElementById("lifespanText");
    lifespanText.innerHTML = width + ',000 years';
  }
  
  function startLifespanDecrease(){
    lifespanDecreaseId = setInterval(decreaseLifespanBar, 1000); //1% in 1sec;
    console.log("lifespanDecreaseId: " + lifespanDecreaseId);
  }
  
  function stopLifespanDecrease(){
    clearInterval(lifespanDecreaseId);
  }
  
  function decreaseLifespanBar(){
    let currentWidth = lifespan.style.width.split("%")[0];
    console.log("currentWidth: " + currentWidth);
//    displayLifespan(currentWidth - 1);
    writeLifespanToDB(currentWidth - 1); //should it be written every second or in the very end of the user session?
  }
  
  function writeLifespanToDB(width){
    writeToDB({"lifespan" : width});
  }
  
  // Parameter updatesForCurrentUser accepts an object, with key-value pairs,
  // where key is a key in DB under "users/userUID" node, 
  // and value - the new value to write.
  function writeToDB(updatesForCurrentUser){
    firebase.auth().onAuthStateChanged(function (user) {
      if(user){
        firebase.database().ref("users/" + user.uid).update(updatesForCurrentUser);
      }
  });
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        var currentUid = user.uid;
        console.log("currentUid: " + currentUid);

        var dbRef = firebase.database().ref().child("users/" + currentUid + "/lifespan"); 
        dbRef.on(
          'value',
          function(snapshot) {
          displayLifespan(snapshot.val());
        });
      startLifespanDecrease();
    }
  });
  

})();