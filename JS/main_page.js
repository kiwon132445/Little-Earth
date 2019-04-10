(function () {

    $(document).ready(function () {

        initializeUser(function () {

            displayUserName(getUserName());
            subscribeForDbLifespanChange(displayLifespan);
            subscribeForDbExperienceChange(displayExperience);
            subscribeForDbLifespanChange(checkIfLose);
            subscribeForDbExperienceChange(checkIfWin);
            start();
            handleWaterActionBtnClick();

        });

    });

    function displayUserName(userName) {
        document.getElementById("userName").append(userName + "!");
    }

    function handleWaterActionBtnClick() {
        $("#actionWater").click(function (e) {
            console.log("Water action clicked");
            window.location.href = "minigame_water.html";
        });
    }

    function checkIfWin(experience){
        if (experience >= 100){
            stopLifespanDecrease();            
            winTheGame();
        }
    }

    function checkIfLose(lifespan){
        if (lifespan <= 0){
            stopLifespanDecrease();            
            loseTheGame();
        }
    }

    function winTheGame(){
        console.log("You won!");
    }

    function loseTheGame(){
        console.log("You lost!");
    }

    function displayLifespan(width) {
        const lifespan = document.getElementById("lifespan");
        const lifespanJQ = $("#lifespan");

        if (width > 97) {
            lifespan.style.borderRadius = '20px';
        }
        lifespan.style.width = width + '%';

        if (width < 15) {
            lifespanJQ.removeClass().addClass("red");
        } else if (width < 30) {
            lifespanJQ.removeClass().addClass("orange");
        } else if (width < 60) {
            lifespanJQ.removeClass().addClass("yellow");
        } else {
            lifespanJQ.removeClass().addClass("green");
        }

        var lifespanText = document.getElementById("lifespanText");
        lifespanText.innerHTML = width + ',000 years';
    }

    function displayExperience(width) {
        const experience = document.getElementById("experience");

        if (width > 97) {
            experience.style.borderRadius = '20px';
        }
        experience.style.width = width + '%';

        var experienceText = document.getElementById("experienceText");
        experienceText.innerHTML = width + (width==1 ? ' percent' : ' percents');
    }

})();