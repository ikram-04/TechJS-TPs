#!/usr/bin/env node

const { getPokemonByName, getRandomPokemon, buildFighterFromPokemon } = require("./api");
const { startBattle } = require("./game");
const inquirer = require("inquirer");

async function main() {
  console.log("=====================================");
  console.log("   MINI JEU POKEMON - NODE.JS");
  console.log("=====================================");

  try {
    const { playerPokemonName } = await inquirer.prompt([
      {
        type: "input",
        name: "playerPokemonName",
        message: "Entre le nom de ton Pokémon :",
        validate: (input) => {
          if (input.trim() === "") {
            return "Le nom ne peut pas être vide.";
          }
          return true;
        }
      }
    ]);

    const playerPokemonData = await getPokemonByName(playerPokemonName.trim());
    const botPokemonData = await getRandomPokemon();

    const player = await buildFighterFromPokemon(playerPokemonData);
    const bot = await buildFighterFromPokemon(botPokemonData);

    console.log("\nTon Pokémon est prêt !");
    console.log(`Nom: ${player.name}`);
    console.log("Ses 5 attaques sont :");
    player.moves.forEach((move, index) => {
      console.log(
        `${index + 1}. ${move.name} | Power: ${move.power} | Accuracy: ${move.accuracy} | PP: ${move.pp}`
      );
    });

    console.log("\nLe Pokémon du bot est prêt !");
    console.log(`Nom: ${bot.name}`);
    console.log("Ses 5 attaques sont :");
    bot.moves.forEach((move, index) => {
      console.log(
        `${index + 1}. ${move.name} | Power: ${move.power} | Accuracy: ${move.accuracy} | PP: ${move.pp}`
      );
    });

    await startBattle(player, bot);
  } catch (error) {
    console.log("\nErreur :", error.message);
    console.log("Vérifie le nom du Pokémon et réessaie.");
  }
}

main();