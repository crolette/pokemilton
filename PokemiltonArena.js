const { saveGameState } = require("./filesystem");

class PokemiltonArena {
  constructor(pokemilton_1, pokemilton_2 = {}) {
    this.pokemiltonUser = pokemilton_2;
    this.pokemiltonWild = pokemilton_1;
  }

  async startBattle(pokemiltonWorld, pokemiltonMaster, round) {
    let answer =
      await rl.question(`\n!!! LET's FIGHT - Battle round ${round} !!!
What action do you want to do? 
1. Attack
2. Try to catch
3. Run away
------------------------------------------
Your choice (1-3): `);
    answer = Number(answer);
    switch (answer) {
      //attack
      case 1:
        return 1;
      // try to catch
      case 2:
        return 2;
      // run away
      case 3:
        return 3;
    }
  }

  async attack(pokemiltonWorld, pokemiltonMaster, round) {
    console.clear();
    pokemiltonWorld.addLog(`BATTLE ROUND ${round}`);
    let log = this.pokemiltonUser.attack(this.pokemiltonWild);
    pokemiltonWorld.addLog(log);
    log = this.pokemiltonWild.attack(this.pokemiltonUser);
    pokemiltonWorld.addLog(log);
    pokemiltonMaster.pokemiltonCollection.map((elem) => {
      if (elem.name == this.pokemiltonUser.name) {
        elem.healthPool = this.pokemiltonUser.healthPool;
      }
    });

    // saveGameState(pokemiltonWorld, pokemiltonMaster);
  }

  tryToCatch(pokemiltonWorld, pokemiltonMaster, round) {
    pokemiltonWorld.addLog(`BATTLE ROUND ${round}`);
    if (pokemiltonMaster.POKEBALLS == 0) {
      pokemiltonWorld.addLog(
        `You do not have enough POKEBALLS to catch the Pokemilton.`
      );
      return false;
    }
    let chancesToCatch = Math.round(
      Math.random() *
        (1 - this.pokemiltonWild.healthPool / this.pokemiltonWild.healthMax)
    );

    if (pokemiltonMaster.POKEBALLS > 0 && chancesToCatch == 1) {
      pokemiltonWorld.addLog(`You catched ${this.pokemiltonWild.name}`);
      pokemiltonMaster.pokemiltonCollection.push(this.pokemiltonWild);
      pokemiltonMaster.POKEBALLS--;

      return true;
    } else {
      pokemiltonMaster.POKEBALLS--;
      pokemiltonWorld.addLog(`You didn't catched ${this.pokemiltonWild.name}`);
      pokemiltonWorld.addLog(this.pokemiltonWild.attack(this.pokemiltonUser));
      return false;
    }
  }

  checkBattleStatus() {
    if (this.pokemiltonUser.healthPool == 0) {
      return [0, `Your Pokemilton ${this.pokemiltonUser.name} is dead! ☠️`];
    } else if (this.pokemiltonWild.healthPool == 0) {
      return [0, `You killed ${this.pokemiltonWild.name}, well done! ☠️`];
    } else {
      return [
        1,
        `❤️ ${this.pokemiltonUser.name} ${this.pokemiltonUser.healthPool}/${this.pokemiltonUser.healthMax} vs. ❤️ ${this.pokemiltonWild.name} ${this.pokemiltonWild.healthPool}/${this.pokemiltonWild.healthMax}`,
      ];
    }
  }

  endBattle(pokemiltonWorld, pokemiltonMaster, round) {
    if (round < 2) {
      return pokemiltonWorld.addLog(
        "You need to battle at least 1 round to gain experience."
      );
    }
    pokemiltonWorld.addLog(`END OF THE BATTLE - STATS`);
    pokemiltonWorld.addLog(
      `❤️ ${this.pokemiltonUser.name} ${this.pokemiltonUser.healthPool}/${this.pokemiltonUser.healthMax} vs. ❤️ ${this.pokemiltonWild.name} ${this.pokemiltonWild.healthPool}/${this.pokemiltonWild.healthMax}`
    );
    this.pokemiltonUser.gainExperience(
      this.pokemiltonWild.level,
      pokemiltonWorld,
      pokemiltonMaster
    );
    // console.log(pokemiltonMaster.pokemiltonCollection);
    pokemiltonMaster.pokemiltonCollection.map((elem) => {
      if (elem.name == this.pokemiltonUser.name) {
        elem.experienceMeter = this.pokemiltonUser.experienceMeter;
        elem.level = this.pokemiltonUser.level;
        elem.attackRange = this.pokemiltonUser.attackRange;
        elem.defenseRange = this.pokemiltonUser.defenseRange;
        elem.healthMax = this.pokemiltonUser.healthMax;
      }
    });
  }
}

module.exports = PokemiltonArena;
