$(document).ready(function() {

	var characters = {

		"hanSolo": {
			name: "HansSolo",
			health: 180,
			attack: 7,
			imageUrl: "assets/images/hansolo.jpg",
			enemyAttackBack: 10
		},

		"r2d2": {
			name: "R2 D2",
			health: 150,
			attack: 8,
			imageUrl: "assets/images/r2d2.jpg",
			enemyAttackBack: 20
		},

		"vader": {
			name: "Darth Vader",
			health: 120,
			attack: 8,
			imageUrl: "assets/images/vader.jpg",
			enemyAttackBack: 5
		},

		"yoda": {
			name: "Yoda",
			health: 100,
			attack: 14,
			imageUrl: "assets/images/yoda.jpg",
			enemyAttackBack: 20
		},

	};

	var currentselectedCharacter; 	//var for selected character
	var currentDefender; 			//var for selected Enemy
	var fighters =[];				//var for remaining Enemies
	var attackResult;				//var for remaining HP of both Fighter and Enemy
	var turnCounter = 1;			//var for each click 
	var killCount = 0;				//var for kill count

	


var charBlock = function(character, displayArea, makeChar) {

    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(displayArea).append(charDiv);
   
    if (makeChar == 'enemy') {
      $(charDiv).addClass('enemy');
    } else if (makeChar == 'defender') {
      currentDefender = character;
      $(charDiv).addClass('target-enemy');
    }
  };


	var displayMessage = function(message) {
		var messageText = $("#gameMessage");
		var newMessage = $("<div>").text(message);
		messageText.append(newMessage);

		if (message == "clearMessage") {
			messageText.text("");
		}
	};

	var displayCharacters = function(charObj, areaDisplay) {
		if (areaDisplay = "#characters") {
			$(areaDisplay).empty();
			for (var key in charObj) {
        		if (charObj.hasOwnProperty(key)) {
          			charBlock(charObj[key], areaDisplay, "");
        		}		
      		}
		}
	
		if (areaDisplay == "#chosenCharacter") {
			$('#selected-character').prepend("Your Character"); 
		 	charBlock(charObj, areaDisplay, "");
		 	$('#attackButton').css('visibility', 'visible');

		}

		if (areaDisplay == "#availableToAttack") {
			$("availableToAttack").prepend("Choose Your Next Opponent"); 
			for (var i = 0; i < charObj.length; i++) {
				charBlock(charObj[i], areaDisplay, "enemy");
			}
			
			$(document).on("click", ".enemy", function() {
				name =($(this).data("name"));

				if ($("#defender").children().length === 0) {

				displayCharacters(name, "#defender");
					$(this).hide();
					displayMessage("clearMessage");
				}
			});
		}

		if (areaDisplay == "#defender") {
			$(areaDisplay).empty();
			for (var i= 0; i < fighters.length; i++) {

				if (fighters[i].name == charObj) {
					$('#defender').append("Your selected opponent")
					charBlock(fighters[i], areaDisplay, defender);
				}
			}
		}

		if (areaDisplay == "playerDamage") {
			$("#defender").empty();
			$('#defender').append("Your selected opponent")
			charBlock(charObj, "#defender", "defender");
		}

		if (areaDisplay == "enemyDamage") {
			$("#chosenCharacter").empty();
			charBlock(charObj, "#chosenCharacter", "");
		}

		if (areaDisplay == "enemyDefeated") {
			$("#defender").empty();
			var messagesetText = "You have defeated " + charObj.name + ", choose your next opponent.";
			displayMessage(messagesetText);
		}
	};

	displayCharacters(characters, "#characters");
		$(document).on("click", ".character", function() {
		name = $(this).data("name");

		if (!currentselectedCharacter) {
      		currentselectedCharacter = characters[name];
      		for (var key in characters) {
        		if (key != name) {
          	fighters.push(characters[key]);
        	}
        }
		$("#characters").hide();
		displayCharacters(currentselectedCharacter, "#chosenCharacter");
		
		displayCharacters(fighters, "#availableToAttack");
		}	
	});


	$("#attackButton").on("click", function() {

		if ($("#defender").children().length !== 0) {
			var attackMessage = "You attacked " + currentDefender.name + " for " + (currentselectedCharacter.attack * turnCounter) +" damage.";
		displayMessage("clearMessage");
		
		currentDefender.health = currentDefender.health - (currentselectedCharacter.attack * turnCounter);

		if (currentDefender.health > 0) {
			displayCharacters(currentDefender, "playerDamage");

			var counterAttackMessage = currentDefender.name + " attacked you back for " + currentDefender.enemyAttackBack + " damage.";
			displayMessage(attackMessage);
			displayMessage(counterAttackMessage);

			currentselectedCharacter.health = currentselectedCharacter - currentDefender.enemyAttackBack;
			displayCharacters(currentselectedCharacter,"enemyDamage");
			
		if (currentselectedCharacter.health <= 0) {
          	displayMessage("clearMessage");
          	restartGame("You have forsaken the force...GAME OVER!!!");
          
          	$("#attackButton").unbind("click");
        	}
      	} else {
       	displayCharacters(currentDefender, "enemyDefeated");
      
      	killCount++;
        if (killCount >= 3) {
        	renderMessage("clearMessage");
          	restartGame("You Won!!!!");
        }
    }
      
    turnCounter++;

    } 	else {
   		displayMessage("clearMessage");
      	displayMessage("No enemy here.");
    	}
 	});
	
  	var restartGame = function(inputEndGame) {
   
    var restart = $('<button class="btn">Restart</button>').click(function() {
      location.reload();
    });
    var gameState = $("<div>").text(inputEndGame);
    $("#gameMessage").append(gameState);
    $("#gameMessage").append(restart);
  };

});


