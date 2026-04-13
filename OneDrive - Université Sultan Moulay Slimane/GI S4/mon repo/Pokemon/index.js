const inquirer = require("inquirer");           
const { fetchPokemon } = require("./pokemon");  
const { GameEngine } = require("./game");       

const bar = (hp, max) => {
  const filled = Math.round((hp / max) * 20);
  return "█".repeat(filled) + "░".repeat(20 - filled);
};

const showStatus = (player, bot) => {
  console.log(`\n❤️  ${player.name}: [${bar(player.hp, player.maxHp)}] ${Math.max(0, player.hp)}/${player.maxHp}`);
  console.log(`🤖  ${bot.name}:   [${bar(bot.hp, bot.maxHp)}] ${Math.max(0, bot.hp)}/${bot.maxHp}\n`);
};

const playTurn = async (engine) => {
  const { player, bot } = engine;

  showStatus(player, bot);

  const { moveIndex } = await inquirer.prompt([
    {
      type: "list",
      name: "moveIndex",
      message: "Choisissez une attaque :",
      choices: player.moves.map((m, i) => ({
        name: `${m.name.padEnd(20)} | Puissance: ${String(m.power).padStart(3)} | Précision: ${m.accuracy}% | PP: ${m.pp}`,
        value: i,
      })),
    },
  ]);

  engine.playerAttack(moveIndex);
  if (!engine.isOver()) engine.botAttack();
};

const askPokemon = async () => {
  while (true) {
    const { pokemonName } = await inquirer.prompt([
      {
        type: "input",
        name: "pokemonName",
        message: "Entrez le nom de votre Pokémon :",
        validate: (v) => v.trim() !== "" || "Le nom ne peut pas être vide.",
      },
    ]);

    try {
      const pokemon = await fetchPokemon(pokemonName);
      return pokemon;
    } catch {
      console.log(`\n❌ "${pokemonName}" n'est pas un Pokémon valide. Essayez : pikachu, charizard, eevee...\n`);
    }
  }
};

// ── Main ─────────────────────────────────────────────────────────

const main = async () => {
  console.log("╔════════════════════════════╗");
  console.log("║    🎮  POKÉMON BATTLE CLI  ║");
  console.log("╚════════════════════════════╝\n");

  // Choix du Pokémon joueur (avec redemande si invalide)
  const player = await askPokemon();

  // Pokémon du bot choisi aléatoirement
  const botPool = ["pikachu", "charmander", "bulbasaur", "squirtle", "mewtwo"];
  const botName = botPool[Math.floor(Math.random() * botPool.length)];

  console.log(`\nChargement du bot (${botName})...`);
  const bot = await fetchPokemon(botName);

  console.log(`\n⚔️  ${player.name.toUpperCase()} VS ${bot.name.toUpperCase()}\n`);

  // Création du moteur de jeu
  const engine = new GameEngine(player, bot);

  // Écouteurs d'événements (comme dans le cours)
  engine.on("attack", ({ attacker, defender, move, remaining }) => {
    console.log(`💥 ${attacker} utilise ${move.name} → ${move.power} dégâts → ${defender} : ${remaining} HP restants`);
  });

  engine.on("miss", ({ attacker, move }) => {
    console.log(`💨 ${attacker} utilise ${move.name} mais rate ! (précision: ${move.accuracy}%)`);
  });

  engine.on("blocked", ({ attacker, move }) => {
    console.log(`🚫 ${attacker} essaie ${move.name} mais PP trop faible — attaque annulée !`);
  });

  engine.on("end", ({ winner }) => {
    console.log(`\n🏆 Fin du combat ! Vainqueur : ${winner.toUpperCase()}\n`);
  });

  // Boucle de jeu
  while (!engine.isOver()) {
    await playTurn(engine);
  }
};

main();