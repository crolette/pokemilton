const students = [
  "Sop",
  "hie",
  "Man",
  "on",
  "Quen",
  "tin",
  "Sam",
  "uel",
  "Jona",
  "than",
  "Dan",
  "iel",
  "Cyr",
  "il",
  "Dam",
  "ien",
  "Auré",
  "liane",
  "Den",
  "is",
  "Emi",
  "lie",
  "Jér",
  "ôme",
  "Quen",
  "tin",
  "Nat",
  "alya",
  "Auré",
  "lien",
  "Chris",
  "tophe",
  "Gil",
  "les",
  "Cél",
  "ine",
  "Mari",
  "lou",
  "Lou",
  "is",
  "Math",
  "ilde",
  "Enk",
  "elan",
  "Ma",
  "rc",
  "Yas",
  "mine",
  "Sam",
  "uel",
  "Thom",
  "as",
  "Jul",
  "ien",
  "Greg",
  "ory",
  "Cyr",
  "ille",
  "Ken",
  "ny",
];

class Pokemilton {
  constructor(minLevel = 1, maxLevel = 1) {
    this.name = this.generateRandomName();
    this.level = this.getRandomNumber(minLevel, maxLevel);
    this.experienceMeter = 0;
    this.attackRange = this.getRandomNumber(3, 8) * this.level;
    this.defenseRange = this.getRandomNumber(1, 3) * this.level;
    this.healthPool = this.getRandomNumber(10, 30) * this.level;
    this.healthMax = this.healthPool;
    this.catchPhrase = this.generateCatchPhrase();
  }

  generateRandomName() {
    let randomStudent1 = students[Math.floor(Math.random() * students.length)];
    randomStudent1 =
      randomStudent1.charAt(0).toUpperCase() + randomStudent1.slice(1);
    let randomStudent2 =
      students[Math.floor(Math.random() * students.length)].toLowerCase();

    return `${randomStudent1}${randomStudent2}`;
  }

  getRandomNumber(min, max) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  generateCatchPhrase() {
    const phrases = [
      "I choose you!",
      "Let the battle begin!",
      "Pokemilton, go!",
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  attack(defender) {
    let damage =
      this.getRandomNumber(this.attackRange, this.attackRange * this.level) -
      defender.defenseRange;
    if (damage < 0) {
      damage = 1;
      defender.healthPool -= damage;
    } else if (damage > defender.healthPool) {
      defender.healthPool = 0;
    } else {
      defender.healthPool -= damage;
    }
    return `${this.name} attacked ${defender.name} and dealt ${damage} damage!`;
  }

  gainExperience(opponentLevel, pokemiltonWorld, pokemiltonMaster) {
    const experienceGain = this.getRandomNumber(1, 5) * opponentLevel;
    const moneyGain = this.getRandomNumber(1, 5) * opponentLevel;
    pokemiltonMaster.money += moneyGain;
    const oldExperience = this.experienceMeter;
    this.experienceMeter += experienceGain;
    pokemiltonWorld.addLog(
      `${this.name} gained ${experienceGain} experience points! (🦾: ${oldExperience} => ${this.experienceMeter})`
    );
    if (this.experienceMeter >= this.level * 100) {
      this.evolve(pokemiltonWorld);
    }
  }

  evolve(pokemiltonWorld) {
    this.level += 1;
    const attackIncrease = this.getRandomNumber(1, 5);
    const defenseIncrease = this.getRandomNumber(1, 5);
    const healthIncrease = this.getRandomNumber(1, 5);
    this.attackRange += attackIncrease;
    this.defenseRange += defenseIncrease;
    this.healthMax += healthIncrease;
    pokemiltonWorld.addLog(
      `${this.name} evolved into a higher level! New stats: Lvl ${this.level}, ⚔️ ${this.attackRange}, 🛡️ ${this.defenseRange}, ❤️ ${this.healthMax}`
    );
  }

  sayCatchPhrase() {
    console.log(`${this.name} says: "${this.catchPhrase}"`);
  }
}

module.exports = Pokemilton;
