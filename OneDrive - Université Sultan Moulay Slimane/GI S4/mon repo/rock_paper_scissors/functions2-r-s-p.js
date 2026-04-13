let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();



document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });

  /*
  Add an event listener
  if the user presses the key r => play rock
  if the user presses the key p => play paper
  if the user presses the key s => play scissors
  */
  
  document.body.addEventListener('keydown',(event)=>{
    if(event.key==='r')
      playGame('rock');
    else if(event.key==='p')
      playGame('paper');
    else if(event.key==='s')
      playGame('scissors');
  });


function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';

  // calculate result
  if(playerMove==='rock'){
    if(computerMove==='rock'){
      result='tie';
    }else if(computerMove==='paper'){
      result='loss';
    }else if(computerMove==='scissors'){
      result='win';
    }
  }else if(playerMove==='paper'){
    if(computerMove==='paper'){
      result='tie';
    }else if(computerMove==='scissors'){
      result='loss';
    }else if(computerMove==='rock'){
      result='win';
    }
  }else if(playerMove==='scissors'){
    if(computerMove==='scissors'){
      result='tie';
    }else if(computerMove==='rock'){
      result='loss';
    }else if(computerMove==='paper'){
      result='win';
    }
  }
  // update the score and store it using localStorage.setItem
  if(result==='win'){
    score.wins++;
  }else if(result==='loss'){
    score.losses++;
  }else{
    score.ties++;
  }
  localStorage.setItem('score', JSON.stringify(score));
  // show the new score and the updated images using "document.querySelector"
  updateScoreElement();
  document.querySelector('.js-result')
    .innerHTML = `You <img src="images/${playerMove}-emoji.png" class="move-icon"> - Computer <img src="images/${computerMove}-emoji.png" class="move-icon"><br>${result.toUpperCase()}!`;
}

function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}