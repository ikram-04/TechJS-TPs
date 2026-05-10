const inquirer = require("inquirer");
const { randomChoice, getRandomInt, sleep } = require("./utils");

function displayFighter(fighter) {
  console.log(`\n${fighter.name.toUpperCase()}`);
  console.log(`HP: ${fighter.hp}`);
  console.log("Moves:");
  fighter.moves.forEach((move, index) => {
    console.log(
      `${index + 1}. ${move.name} | Power: ${move.power} | Accuracy: ${move.accuracy} | PP: ${move.pp}`
    );
  });
}

async function choosePlayerMove(player) {
  const choices = player.moves.map((move, index) => ({
    name: `${index + 1}. ${move.name} | Power: ${move.power} | Accuracy: ${move.accuracy} | PP: ${move.pp}`,
    value: move
  }));

  const { selectedMove } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedMove",
      message: "Choisis une attaque :",
      choices: choices
    }
  ]);

  return selectedMove;
}

function chooseBotMove(bot) {
  return randomChoice(bot.moves);
}

function canAttackByPPRule(attackerMove, enemyMove) {
  return attackerMove.pp >= enemyMove.pp;
}

function doesMoveHit(move) {
  const roll = getRandomInt(1, 100);
  return roll <= move.accuracy;
}

function applyDamage(defender, move) {
  defender.hp -= move.power;
  if (defender.hp < 0) {
    defender.hp = 0;
  }
}

async function executeTurn(attacker, defender, attackerMove, defenderMove) {
  console.log(`\n${attacker.name} veut utiliser ${attackerMove.name}`);

  if (attackerMove.pp <= 0) {
    console.log(`Mais ${attackerMove.name} n'a plus de PP.`);
    return;
  }

  if (!canAttackByPPRule(attackerMove, defenderMove)) {
    console.log(
      `Mais l'attaque échoue car le PP de ${attackerMove.name} (${attackerMove.pp}) est inférieur à celui de ${defenderMove.name} (${defenderMove.pp}).`
    );
    return;
  }

  attackerMove.pp--;

  if (!doesMoveHit(attackerMove)) {
    console.log(`L'attaque ${attackerMove.name} a raté.`);
    return;
  }

  applyDamage(defender, attackerMove);
  console.log(
    `${attacker.name} inflige ${attackerMove.power} dégâts à ${defender.name}.`
  );
  console.log(`${defender.name} a maintenant ${defender.hp} HP.`);
}

async function startBattle(player, bot) {
  console.log("\n==============================");
  console.log("       DEBUT DU COMBAT");
  console.log("==============================");

  console.log(`\nLe joueur a choisi: ${player.name}`);
  console.log(`Le bot a choisi: ${bot.name}`);

  while (player.hp > 0 && bot.hp > 0) {
    console.log("\n------------------------------");
    console.log("Tour suivant");
    console.log(`${player.name}: ${player.hp} HP`);
    console.log(`${bot.name}: ${bot.hp} HP`);
    console.log("------------------------------");

    displayFighter(player);

    const playerMove = await choosePlayerMove(player);
    const botMove = chooseBotMove(bot);

    console.log(`\nLe bot a choisi ${botMove.name}`);

    await sleep(500);

    await executeTurn(player, bot, playerMove, botMove);

    if (bot.hp <= 0) {
      console.log(`\n${bot.name} est KO !`);
      console.log("Le joueur gagne !");
      break;
    }

    await sleep(500);

    await executeTurn(bot, player, botMove, playerMove);

    if (player.hp <= 0) {
      console.log(`\n${player.name} est KO !`);
      console.log("Le bot gagne !");
      break;
    }
  }
}

module.exports = {
  startBattle
};
