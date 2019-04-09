(function () {

    $(document).ready(function () {

        initializeUser(function (userData) {

            // let { name } = userData.val();
            displayUserName(getUserName());
            subscribeForDbLifespanChange(displayLifespan);
            start();
            handleWaterActionBtnClick();

        });

    });

    //not used
    function getCurrentLifespanBarWidth() {
        return parseInt(lifespan.style.width.split("%")[0]);
    }

    function displayUserName(userName) {
        document.getElementById("userName").append(userName + "!");
    }

    function handleWaterActionBtnClick() {
        $("#actionWater").click(function (e) {
            console.log("Water action clicked");
            window.location.href = "minigame_water.html";
        });
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

})();