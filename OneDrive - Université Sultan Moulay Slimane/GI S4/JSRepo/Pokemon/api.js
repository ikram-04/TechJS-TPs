const { randomChoice } = require("./utils");

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
async function getPokemonByName(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  const data = await fetchJSON(url);

  return data;
}

async function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
  const data = await fetchJSON(url);

  return data;
}

async function getMoveDetails(moveUrl) {
  const moveData = await fetchJSON(moveUrl);

  return {
    name: moveData.name,
    power: moveData.power ?? 10,
    accuracy: moveData.accuracy ?? 100,
    pp: moveData.pp ?? 1
  };
}

async function getFiveValidMoves(pokemonData) {
  const rawMoves = pokemonData.moves;

  if (!rawMoves || rawMoves.length === 0) {
    throw new Error("Ce Pokémon n'a pas de moves.");
  }

  const shuffled = [...rawMoves].sort(() => Math.random() - 0.5);//mélanger les attaques.

  const validMoves = [];

  for (const moveEntry of shuffled) {
    if (validMoves.length === 5) {
      break;
    }

    try {
      const move = await getMoveDetails(moveEntry.move.url);

      if (move.power !== null && move.accuracy !== null && move.pp !== null) {
        validMoves.push(move);
      }
    } catch (error) {
      // ignore les moves qui posent problème
    }
  }

  while (validMoves.length < 5) {
    validMoves.push({
      name: "struggle",
      power: 15,
      accuracy: 100,
      pp: 999
    });
  }

  return validMoves;
}

async function buildFighterFromPokemon(pokemonData) {
  const moves = await getFiveValidMoves(pokemonData);

  return {
    name: pokemonData.name,
    hp: 300,
    moves
  };//Transformer les données brutes du Pokémon en personnage de comba
}

module.exports = {
  getPokemonByName,
  getRandomPokemon,
  buildFighterFromPokemon
};