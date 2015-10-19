$(window).load(function() {

	// this resets EVErytHING
	$('#reset').click(function(){
		location.reload();
	});

	// the bank lives out here so it's persistant
	var $playerBank = 100;
	$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');

	var $startButton = $('<button/>').appendTo('#statusSection').html('Start').click(function(){;

		// lets get rid of this button
		$startButton.remove();
		$('#dealersHand, #player1').empty();
		playHand();

	});

		// first lets set up our cards
		function card(value, name, suit) {
			this.value = value;
			this.name = name;
			this.suit = suit;
		}

		function deck() {
		  this.values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
		  this.names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
			this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
			var cards = [];
		    for (var s = 0; s < this.suits.length; s++ ) {
		      for (var n = 0; n < this.names.length; n++ ) {
		        cards.push( new card( this.values[n], this.names[n], this.suits[s] ) );
		      }
		    }
		  return cards;
		}

		var cardDeck = new deck();

		// shuffle function!
		function shuffle(a) {
			for(var b, c, d = a.length; d; b = parseInt(Math.random() * d), c = a[--d], a[d] = a[b], a[b] = c);
			return a;
		};

		cardDeck = shuffle(cardDeck);

	var playHand = function(){

		// this sets up the player's hand
		var playersCards = [];
		var playerAces = 0;
		var playerAcesUsed = 0;
		var playersValue = 0;

		// this deals with the player's aces
		var playerVsAces =  function(){
			if (playerAces > 0){
				--playerAces;
				playerAcesUsed++;
			}
		};

		// let's give the player some cards
		var playerDeal = function(){
		  for (var e = 0; e < 2; e++) {
		    var givePlayerCard = cardDeck.shift();
		    playersCards.unshift(givePlayerCard);

		    //Did we get any aces? This will matter later
		    if (givePlayerCard.name === 'A'){
		      playerAces++;
		    }
		  }

		  //calculating player's hand value at first deal this is going to get more styling later
		  playersValue = playersCards[0].value + playersCards[1].value;

			// did we get 21 right away?
			if (playersValue === 21){
				$( '#stand' ).remove();
		  }

			if (playersValue > 21){
		    playerVsAces();
		  }

			//let's put the player's cards into the dom!
		  for (var e = 0; e < 2; e++) {
		    var $card = $('<div/>').appendTo('#player1');
		    $($card).addClass('card');
		    if(playersCards[e].suit == 'Diamonds'){
		  			var ascii_char = '♦';
		  		} else {
		  			var ascii_char = '&' + playersCards[e].suit.toLowerCase() + ';';
		  		}
				if(playersCards[e].suit == 'Diamonds' || playersCards[e].suit == 'Hearts'){
					$($card).css({'color': '#741012'});
				}
		    $($card).html(playersCards[e].name + " " +  ascii_char);
		  }
		};
		playerDeal();

		// this sets up the dealer's hand
		var dealersCards = [];
		var dealerAces = 0;
		var dealerAcesUsed = 0
		var dealersValue = 0;

		var dealerVsAces =  function(){
			if (dealerAces > 0){
				--dealerAces;
				dealerAcesUsed++;
			}
		}

		var dealerDeal = function(){

		  for (var e = 0; e < 2; e++) {
		    var giveDealerCard = cardDeck.shift();
		    dealersCards.unshift(giveDealerCard);

		    //Did the dealer get any aces? This will matter later
		    if (giveDealerCard.name === 'A'){
		      dealerAces++;
		    }
		  }

		  //calculating dealer's hand value at deal
		  dealersValue = dealersCards[0].value + dealersCards[1].value;

			// did the dealer get aces?
		  if (dealersValue > 21){
		    if (dealerAces = 2){
		      dealerVsAces();
		    }
		  }

		  // this will visually represent the dealer's hand in the DOM
		  for (var e = 0; e < 2; e++) {

				// this puts one card "down" and one "up"
				if (e === 0){
					var $card = $('<div/>').appendTo('#dealersHand').attr('id', 'firstCard');
			    $($card).addClass('card');
					$($card).css({
						'background-image':'url("images/card_back.jpg")',
						'background-position':'center',
						'color': 'rgba(0, 0, 0, 0)'
					});
					if(dealersCards[0].suit == 'Diamonds'){
			  			var ascii_char = '♦';
			  		} else {
			  			var ascii_char = '&' + dealersCards[0].suit.toLowerCase() + ';';
			  		}
					if(dealersCards[0].suit == 'Diamonds' || dealersCards[0].suit == 'Hearts'){
						$($card).addClass('redCard');
					}
			    $($card).html(dealersCards[e].name + " " +  ascii_char);
				}

				if (e === 1){
					var $card = $('<div/>').appendTo('#dealersHand');
			    $($card).addClass('card');
					if(dealersCards[1].suit == 'Diamonds'){
			  			var ascii_char = '♦';
			  		} else {
			  			var ascii_char = '&' + dealersCards[1].suit.toLowerCase() + ';';
			  		}
					if (dealersCards[1].suit == 'Diamonds' || dealersCards[1].suit == 'Hearts'){
						$($card).css({'color': '#741012'});
					}
			    $($card).html(dealersCards[e].name + " " +  ascii_char);
				}
		  }
		};
		dealerDeal();

		// ok, now let's start betting
		var $currentBet = 0;

		$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');

		// this lets the player choose the bet amount. It's pretty wet, but I wanted to try using buttons instead, so the player can't bet "fish" or somethign
		var setBet = function(){
			var $bet10 = $('<button/>').appendTo('#betting').addClass('bet').html('Bet $10').click(function(){
				$('.bet').remove();
				$currentBet = 10;
				$('<article>').appendTo('#betting').html('<h2>Current Bet: $10</h2>').attr({id: 'currentBet', class: 'currentBet'});
				$playerBank = ($playerBank - $currentBet);
				$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');
				hitOrStand();
			});
			var $bet25 = $('<button/>').appendTo('#betting').addClass('bet').html('Bet $25').click(function(){
				$('.bet').remove();
				$currentBet = 25;
				$('<article>').appendTo('#betting').html('<h2>Current Bet: $25</h2>').attr({id: 'currentBet', class: 'currentBet'});
				$playerBank = ($playerBank - $currentBet);
				$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');
				hitOrStand();
			});
			var $bet50 = $('<button/>').appendTo('#betting').addClass('bet').html('Bet $50').click(function(){
				$('.bet').remove();
				$currentBet = 50;
				$('<article>').appendTo('#betting').html('<h2>Current Bet: $50</h2>').attr({id: 'currentBet', class: 'currentBet'});
				$playerBank = ($playerBank - $currentBet);
				$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');
				hitOrStand();
			});
			var $betAll = $('<button/>').appendTo('#betting').addClass('bet').html('Bet All').click(function(){
				$('.bet').remove();
				$currentBet = $playerBank;
				$('<article>').appendTo('#betting').html('<h2>Current Bet: $ ' + $playerBank + '</h2>').attr({id: 'currentBet', class: 'currentBet'});
				$playerBank = ($playerBank - $currentBet);
				$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');
				hitOrStand();
			});
		}
		setBet();

		// this defines the dealer's play after the player has hit stand, or hits BLACKJACK at the draw
		var dealersPlay = function(){

			//let's get rid of the hit and stand buttons
			$( '#hit, #stand' ).remove();

			while(dealersValue <= 17){

				// now the dealer plays
				giveDealerCard = cardDeck.shift();
				dealersCards.unshift(giveDealerCard);
				$card = $('<div/>').appendTo('#dealersHand');
				$($card).addClass('card');
				if(dealersCards[0].suit == 'Diamonds'){
						var ascii_char = '♦';
					} else {
						var ascii_char = '&' + dealersCards[0].suit.toLowerCase() + ';';
					}
				if(dealersCards[0].suit == 'Diamonds' || dealersCards[0].suit == 'Hearts'){
					$($card).css({'color': '#741012'});
				}
				$($card).html(dealersCards[0].name + " " +  ascii_char);

				// let's see what the dealer's hand value is
				dealersValue = dealersCards.reduce(
					function(prev,current){
					return  +(current.value) + prev;
					}, 0
				);

				if (giveDealerCard.name === 'A'){
				 dealerAces++;
				}

				 //lets deal with the dealer's aces
				if (dealersValue > 21){
					 dealerVsAces();
				}

				dealersValue = dealersValue - (dealerAcesUsed * 10);

			}
			compareHands();
		}

		var hitOrStand = function(){

			// we need some play buttons here
			var $hit = $('<button/>').appendTo('#statusSection').attr('id', 'hit').html('Hit');
			var $stand = $('<button/>').appendTo('#statusSection').attr('id', 'stand').html('Stand');

			// this governs the HIT button
		  $('#hit').click(function(){
		    givePlayerCard = cardDeck.shift();
		    playersCards.unshift(givePlayerCard);
		    $card = $('<div/>').appendTo('#player1');
		    $($card).addClass('card');
		    if(playersCards[0].suit == 'Diamonds'){
		  			var ascii_char = '♦';
		  		} else {
		  			var ascii_char = '&' + playersCards[0].suit.toLowerCase() + ';';
		  		}
				if(playersCards[0].suit == 'Diamonds' || playersCards[0].suit == 'Hearts'){
					$($card).css({'color': '#741012'});
				}
		    $($card).html(playersCards[0].name + " " +  ascii_char);

		    // let's see what the player's hand value is
		    playersValue = playersCards.reduce(
			    function(prev,current){
		      return  +(current.value) + prev;
		      }, 0
		    );
		    if (givePlayerCard.name === 'A'){
		     playerAces++;
				}
		     //lets deal with aces
		    else if (playersValue > 21){
		       playerVsAces();
		    }

				// players current score
				playersValue = playersValue - (playerAcesUsed * 10);

				//do we have 21?
			 	if (playersValue === 21){
					dealersPlay();
			 	}

				else if (playersValue > 21 && playerAces === 0) {
					compareHands();

				}
		  });

			$('#stand').click(function(){

				dealersPlay();

			});
		};

		// ok, lets see who won
		var compareHands = function(){

			// let's flip that dealer's card
			if ($('#firstCard').hasClass('redCard')){
				$('#firstCard').css({
				'background-image':'none',
				'color': '#741012'
				});
			}
			else {
				$('#firstCard').css({
				'background-image':'none',
				'color': '#97999b'
				});
			}

			$( '#currentBet h2' ).remove();

			// in case dealersPlay was bypassed
			$( '#hit, #stand' ).remove();

			// TIE ( I DON'T KNOW WHY IT NEEDED ALL THIS JAZZ)
			if ((dealersValue === playersValue)||(playersValue === dealersValue)){
				$('<h2>Tie</h2>').appendTo('#statusSection');
				$playerBank = $playerBank + $currentBet;
				$('#currentBet').html('<h2>Bet returned to bank</h2>');
				$currentBet = 0;
			}

			// DEALER BUSTS
			else if (dealersValue > 21 && dealerAces === 0) {
				$('<h2>Dealer Busts</h2>').appendTo('#statusSection');
				$playerBank = $playerBank + ($currentBet * 2);
				console.log($currentBet);
				$('#currentBet').html('<h2>Player won: $ ' + $currentBet + '</h2>');
				$currentBet = 0;
			}

			// PLAYER BUSTS
			else if (playersValue > 21 && playerAces === 0) {
				$('<h2>PLAYER BUSTS</h2>').appendTo('#statusSection');
				$playerBank = $playerBank - $currentBet
				$('#currentBet').html('<h2>Player lost: $ ' + $currentBet + '</h2>');
				$currentBet = 0;
			}

			// BLACKJACK!
			else if ((dealersValue != 21) && (playersValue === 21)){
				$('<h2>Blackjack!</h2>').appendTo('#statusSection');
				$playerBank = $playerBank + ($currentBet * 2.5);
				$('#currentBet').html('<h2>Player won: $ ' + ($currentBet + ($currentBet / 2)) + '</h2>');
				$currentBet = 0;
			}

			// DEALER WINS
			else if ((dealersValue <= 21) && (dealersValue > playersValue)){
				$('<h2>Dealer Wins</h2>').appendTo('#statusSection');
				$playerBank = $playerBank - $currentBet
				console.log($currentBet);
				$('#currentBet').html('<h2>Player lost: $ ' + $currentBet + '</h2>');
				$currentBet = 0;
			}

			// PLAYER WINS
			else if ((playersValue <= 21) && (dealersValue < playersValue)){
				$('<h2>Player Wins</h2>').appendTo('#statusSection');
				$playerBank = $playerBank + ($currentBet * 2);
				console.log($currentBet);
				$('#currentBet').html('<h2>Player won: $ ' + $currentBet + '</h2>');
				$currentBet = 0;
			}

			// so, are you broke yet? If not, you can keep playing.
			if ($playerBank <= 0){
				$('#statusSection').html('<h2>GAME OVER</h2>');
				$('#bank').html('<h3>You\'ve lost it all!</h3>');
			} else {
			$('#bank').html('<h3>Player Bank: $ ' + $playerBank + '</h3>');
			// let's keep playing!
				var $playAgain = $('<button/>').appendTo('#statusSection').html('Play Again?');
				$playAgain.click(function(){

					$playAgain.remove();
					$( '#statusSection' ).empty();
					$( '#betting h2' ).remove();
					$( '#dealersHand .card').remove();
					$( '#player1 .card').remove();
					playHand();
				});
			}
		};
	};
});
