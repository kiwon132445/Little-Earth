let valve = document.getElementById("valveLevel");
                    let valveWidth = parseInt(valve.style.width.split("%")[0]);

                    let waterFlow = document.getElementById("waterFlow");

                    let waterLevel = document.getElementsByClassName("remainingWater")
                    let waterLevelContainer = document.getElementsByClassName("remainingWaterBar");
                    let waterLevelHeight = parseInt($(waterLevel).height()/$(waterLevelContainer).height() * 100);

                    alert("An evil steel manufacturing business person is thirsty of securing a " 
                    + "freshwater source. They are trying to turn on the tap to divert our "
                    + "valuable source of drinking water for the factory. Hurry! Stop it " 
                    + "by tapping fast to the water tap faucet. \n\nAre you ready to start?");
                    let intervalId = setInterval(openTap, 400);
                    let decreaseInterval = setInterval(waterDecrease, 200);
                    
                    function openTap() {
                        if (valveWidth < 100) {
                            valveWidth += 5;
                            valve.style.width = valveWidth + "%";
                            waterFlowLevel();
                        }
                        
                    }
                    function closeTap() {
                        if (valveWidth > 0) {
                            valveWidth -= 5;
                            valve.style.width = valveWidth + "%";
                            waterFlowLevel();
                            cancelInterval();
                        }
                    }
                    
                    //close game
                    function cancelInterval() {
                        if (valveWidth <= 0 || waterLevelHeight >= 100) {
                            clearInterval(intervalId);
                            clearInterval(decreaseInterval);
                            win();
                            document.getElementsByClassName("gameB")[0].setAttribute("disabled", "disabled");
                            document.getElementsByClassName("gameB")[1].setAttribute("disabled", "disabled");
                        }
                    }
                    //water width
                    function waterFlowLevel() {
                        waterFlow.style.width = valveWidth + "%";
                    }

                    //decrease remaining water
                    function waterDecrease() {
                        if (waterLevelHeight < 100) {
                            waterLevelHeight++;
                            $(waterLevel).height(waterLevelHeight + "%");
                        }
                        cancelInterval()
                        lose();
                    }
                    //win
                    function win() {
                        if (valveWidth <= 0 && waterLevelHeight < 100) {
                            let experienceUpdated = increaseExperience(10);
                            experienceUpdated.then(function(){
                                increaseLifespan(25).then(function(){
                                    let win = new Promise(function(resolve, reject) {
                                        setTimeout(() => resolve(alert(
                                            "You won! \nEarth gains back 25000 years of its lifespan and 10 percents of experience."
                                            )), 100);
                                    });
                                    win.then(
                                        result => window.location.href = "main.html"
                                    );
                                });
                            });
                        }
                    }
                    //lose
                    function lose() {
                        if (valveWidth > 0 && waterLevelHeight >= 100) {
                            decreaseLifespan(15).then(function(){
                                let lose = new Promise(function(resolve, reject) {
                                    setTimeout(() => resolve(alert("You Lost! Earth lost 15000 years of its lifespan.")), 100);
                                });
                                lose.then(
                                    result => window.location.href = "main.html"
                                ); 
                            });
                        }
                    }
                    function exitButton() {
                        let exitConfirm = confirm("Earth will lose 15000 years of its lifespan. \nWill you exit game?");
                        if (exitConfirm == true) {
                            decreaseLifespan(15).then(function(){
                                window.location.href = "main.html";
                            });
                        }
                    }