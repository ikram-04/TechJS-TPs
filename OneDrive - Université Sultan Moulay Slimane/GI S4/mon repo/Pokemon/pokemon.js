
const https = require("node:https");

/**
 * Récupère les données d'un Pokémon depuis la PokéAPI
 * Retourne une Promise
 */
const fetchPokemon = (name) => {
  return new Promise((resolve, reject) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

    https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Pokémon "${name}" introuvable !`));
          return;
        }
        const json = JSON.parse(data);
        resolve(formatPokemon(json));
      });
    }).on("error", reject);
  });
};

/**
 * Extrait les 5 premières attaques + stats utiles
 * Respecte les règles du TP : 5 moves, accuracy, pp
 */
const formatPokemon = (data) => {
  const moves = data.moves
    .slice(0, 5)
    .map((m) => ({
      name: m.move.name,
      power: Math.floor(Math.random() * 80) + 20,   // 20-99
      accuracy: Math.floor(Math.random() * 40) + 60, // 60-99%
      pp: Math.floor(Math.random() * 10) + 5,        // 5-14
    }));

  return {
    name: data.name,
    hp: 300,
    maxHp: 300,
    moves,
  };
};

// Export CommonJS
module.exports = { fetchPokemon };