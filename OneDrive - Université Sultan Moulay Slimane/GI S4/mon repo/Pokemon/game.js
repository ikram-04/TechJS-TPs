const { EventEmitter } = require("node:events"); // built-in module

/**
 * GameEngine étend EventEmitter (comme PizzaShop dans le cours)
 * Émet des événements : "attack", "miss", "blocked", "end"
 */
class GameEngine extends EventEmitter {
  constructor(player, bot) {
    super();
    this.player = player;
    this.bot = bot;
  }

  // Vérifie si une attaque touche selon l'accuracy
  hits(accuracy) {
    return Math.random() * 100 < accuracy;
  }

  // Règle : si le pp de l'attaque < pp max de l'ennemi => annulée
  ppBlocked(attackerMove, defenderMoves) {
    const enemyMaxPp = Math.max(...defenderMoves.map((m) => m.pp));
    return attackerMove.pp < enemyMaxPp;
  }

  // Tour du joueur
  playerAttack(moveIndex) {
    const move = this.player.moves[moveIndex];

    if (this.ppBlocked(move, this.bot.moves)) {
      this.emit("blocked", { attacker: this.player.name, move });
      return;
    }

    if (!this.hits(move.accuracy)) {
      this.emit("miss", { attacker: this.player.name, move });
      return;
    }

    this.bot.hp -= move.power;
    this.emit("attack", {
      attacker: this.player.name,
      defender: this.bot.name,
      move,
      remaining: Math.max(0, this.bot.hp),
    });

    if (this.bot.hp <= 0) {
      this.emit("end", { winner: this.player.name });
    }
  }

  // Tour du bot - choisit une attaque aléatoire
  botAttack() {
    const idx = Math.floor(Math.random() * this.bot.moves.length);
    const move = this.bot.moves[idx];

    if (this.ppBlocked(move, this.player.moves)) {
      this.emit("blocked", { attacker: this.bot.name, move });
      return;
    }

    if (!this.hits(move.accuracy)) {
      this.emit("miss", { attacker: this.bot.name, move });
      return;
    }

    this.player.hp -= move.power;
    this.emit("attack", {
      attacker: this.bot.name,
      defender: this.player.name,
      move,
      remaining: Math.max(0, this.player.hp),
    });

    if (this.player.hp <= 0) {
      this.emit("end", { winner: this.bot.name });
    }
  }

  isOver() {
    return this.player.hp <= 0 || this.bot.hp <= 0;
  }
}

module.exports = { GameEngine };