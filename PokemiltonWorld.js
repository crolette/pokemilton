var readline = require("readline/promises");
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
class PokemiltonWorld {
  constructor(name) {
    this.name = name;
    this.day = 1;
    this.logs = [];
    this.saved_on = "";
  }

  oneDayPasses() {
    this.day++;
    console.clear();
    this.addLog(
      `One day passes. No Pokemilton in the neighbourhood... maybe tomorrow. Day ${this.day} in ${this.name} town.`
    );
    this.addLog(`________________________________________________`);
  }

  randomizeEvent() {
    let randomNumber = (Math.random() * 8) / 10;
    if (randomNumber < 2 / 10) {
      return false;
    } else {
      return true;
    }
  }

  addLog(newLog) {
    console.log(newLog);
    this.logs.push(newLog);
  }

  readLog() {
    this.logs.map((log) => console.log(log));
  }
}

module.exports = PokemiltonWorld;
