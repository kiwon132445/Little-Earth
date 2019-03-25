function popup1() {
    var popup1 = document.getElementById("myPopup1");
   popup1.classList.toggle("show");
   var popup2 = document.getElementById("myPopup2");
   popup2.classList.remove("show");
   var popup3 = document.getElementById("myPopup3");
   popup3.classList.remove("show");
  }
  function popup2() {
    var popup2 = document.getElementById("myPopup2");
   popup2.classList.toggle("show");
   var popup1 = document.getElementById("myPopup1");
   popup1.classList.remove("show");
   var popup3 = document.getElementById("myPopup3");
   popup3.classList.remove("show");
  }
  function popup3() {
    var popup3 = document.getElementById("myPopup3");
   popup3.classList.toggle("show");
   var popup2 = document.getElementById("myPopup2");
   popup2.classList.remove("show");
   var popup1 = document.getElementById("myPopup1");
   popup1.classList.remove("show");
  }