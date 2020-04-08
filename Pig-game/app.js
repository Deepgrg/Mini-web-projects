//Initail game data and logics
var scores , roundScore , activePlayer, gamePoint, flag;
scores = [0,0];
roundScore = 0;
activePlayer = 0;
flag = 10;
gamePoint = 100; 

//Round Score Generator
document.querySelector('.btn-roll').addEventListener('click' , function(){
    //To Generate the random number
    var dice = Math.floor(Math.random() * 6 ) + 1 ;
    document.querySelector('#current-' + activePlayer) .textContent = dice;

    //To display appropraite dice image
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-'+ dice + '.png' ;

    //Add Dice value if it is not 1 else set roundScore to 0
    if(dice !== 1){
        if(flag == dice){
            reset();
            flag= 10;
        }
        else{
            if(dice == 6){
                flag=dice;
            }
            else{
                flag=10;
            }
            roundScore += dice;
            document.querySelector('#current-' + activePlayer) .textContent = roundScore;
        }
    }
    else{
        roundScore =0;
        document.querySelector('#current-' + activePlayer) .textContent = roundScore;
        activePlayer = changeActivePlayer(activePlayer);
    }
});

//To update the global Score
document.querySelector('.btn-hold').addEventListener('click', function(){
    scores[activePlayer] += parseInt(document.querySelector('#current-' + activePlayer) .textContent) ;
    roundScore =0;
    document.querySelector('#current-' + activePlayer).textContent = roundScore;
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    if (scores[activePlayer] >= gamePoint){
        document.querySelector('#name-'+ activePlayer).textContent = 'Winner!';
        document.querySelector('.dice').style.display = 'none'; 
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        document.querySelector('.btn-roll').style.display = 'none';
        document.querySelector('.btn-hold').style.display = 'none';
    }
    else{
        activePlayer=changeActivePlayer(activePlayer);
    }
    
});

//To restart the game
document.querySelector('.btn-new').addEventListener('click', newgame);



//Functions used:

//To change the current active player
function changeActivePlayer(activePlayer){
    //Function to change the player's turn in the game
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    document.querySelector('.dice').style.display = 'none';
    if(activePlayer == 0){
        activePlayer=1;
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
        return activePlayer;
    }
    else{
        activePlayer=0;
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
        return activePlayer;
    }
}

// Initailize a new game
function newgame(){
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.btn-roll').style.display = 'block';
    document.querySelector('.btn-hold').style.display = 'block';
    scores[0]=0;
    scores[1]=0;
    roundScore=0;
}

//Reset the game
function reset(){
    document.getElementById('score-' + activePlayer).textContent = 0;
    document.getElementById('current-' + activePlayer).textContent = 0;
    scores[activePlayer] = 0;
    roundScore =0;
    activePlayer = changeActivePlayer(activePlayer);
}