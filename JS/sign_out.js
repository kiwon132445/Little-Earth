(function(){
  document.getElementById("signOutBtn").addEventListener("click", function(e){
    var promise = firebase.auth().signOut();
    promise.then(function(){
      localStorage.clear();
      window.location.href="index.html";
    });
  });
})();