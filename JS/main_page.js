/**
 * Main page driver. Manages all the events, logic and display that happens on the main page.
 * Game starts here.
 */

(function () {

    // All game logic happens here.
    $(document).ready(function () {

        initializeUser(function () {

            displayUserName(getUserName());
            subscribeForDbLifespanChange(displayLifespan);
            subscribeForDbExperienceChange(displayExperience);
            subscribeForDbLifespanChange(checkIfLose);
            subscribeForDbExperienceChange(checkIfWin);
            start();
            subscribeForWaterActionBtnClick();
            subscribeForSignOutClick();

        });

    });

    function subscribeForSignOutClick() {
        document.getElementById("signOutBtn").addEventListener("click", signOut);
    }

    function subscribeForModalSignOutClick() {
        document.getElementById("signOutModalBtn").addEventListener("click", function () {
            resetScores().then(signOut);
        });
    }

    function subscribeForModalRestartClick() {
        document.getElementById("restartModalBtn").addEventListener("click", function () {
            restartGame();
            hideModal();
        });
    }

    function signOut() {
        firebase.auth().signOut().then(function () {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }

    function displayUserName(userName) {
        document.getElementById("userName").append(userName + "!");
    }

    function subscribeForWaterActionBtnClick() {
        $("#actionWater").click(function (e) {
            console.log("Water action clicked");
            window.location.href = "minigame_water.html";
        });
    }

    function checkIfWin(experience) {
        if (experience >= 100) {
            stopLifespanDecrease();
            winTheGame();
        }
    }

    function checkIfLose(lifespan) {
        if (lifespan <= 0) {
            stopLifespanDecrease();
            loseTheGame();
        }
    }

    // Inserts winning text and shows the end game screen.
    function winTheGame() {
        console.log("You won!");
        let winText = "Yay, you saved me!<br/>Thank you so much!<br/>You are my hero!"
        endGame(winText);
    }

    // To end the game.
    function endGame(finalText) {
        showModal(finalText);
        subscribeForModalSignOutClick();
        subscribeForModalRestartClick();
    }

    // Inserts losing text and shows the end game screen.
    function loseTheGame() {
        console.log("You lost!");
        let loseText = "Whoops!<br/>That didn’t work out this time. <br/>Do you wanna give it another try?"
        endGame(loseText);
    }

    // Hides game over screen.
    function hideModal() {
        $("#modal").addClass("closed");
        $("#modalOverlay").addClass("closed");
    }

    // Shows game over screen.
    function showModal(finalText) {
        $("#finalText").empty();
        $("#finalText").append(finalText);
        $("#modal").removeClass("closed");
        $("#modalOverlay").removeClass("closed");
    }

    // Renders lifespan meter.
    function displayLifespan(width) {
        const lifespan = document.getElementById("lifespan");
        const lifespanJQ = $("#lifespan");
        const earthImage = document.getElementById("earthImg");
        const earthImageJQ = $("#earthImg");

        if (width > 97) {
            lifespan.style.borderRadius = '20px';
        }
        lifespan.style.width = width + '%';

        if (width < 15) {
            earthImageJQ.removeClass("clipped");
            earthImage.src = "CSS/images/sad.png";
            lifespanJQ.removeClass().addClass("red");
        } else if (width < 30) {
            earthImageJQ.removeClass("clipped");
            earthImage.src = "CSS/images/neutral.png";
            lifespanJQ.removeClass().addClass("orange");
        } else if (width < 60) {
            earthImageJQ.addClass("clipped");
            earthImage.src = "CSS/images/earth.jpg";
            lifespanJQ.removeClass().addClass("yellow");
        } else {
            earthImageJQ.removeClass("clipped");
            earthImage.src = "CSS/images/happy.png";
            lifespanJQ.removeClass().addClass("green");
        }

        var lifespanText = document.getElementById("lifespanText");
        lifespanText.innerHTML = width + ',000 years';
    }

    // Renders experience meter.
    function displayExperience(width) {
        const experience = document.getElementById("experience");

        if (width > 97) {
            experience.style.borderRadius = '20px';
        }
        experience.style.width = width + '%';

        var experienceText = document.getElementById("experienceText");
        experienceText.innerHTML = width + (width == 1 ? ' percent' : ' percents');
    }

})();