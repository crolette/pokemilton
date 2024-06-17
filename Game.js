const PokemiltonMaster = require("./PokemiltonMaster");
const PokemiltonWorld = require("./PokemiltonWorld");
const { readFile, saveGameState, deleteProgress } = require("./filesystem");
const chalk = require("chalk");
let worldGame;

var readline = require("readline/promises");
const Pokemilton = require("./Pokemilton");
const PokemiltonArena = require("./PokemiltonArena");
const { clear, log } = require("console");
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// ask for a name for the pokemilton master
async function askForName() {
  const masterName = await rl.question(`What is your Master name ? `);
  const pokemonMaster = new PokemiltonMaster(masterName);
  return pokemonMaster;
}

// propose x pokemilton to choose when starting a new game
async function proposeFirstPokemilton(master, nbPokemiltons) {
  const pokemonChoices = [];

  // create as many Pokemiltons as nbPokemiltons
  for (let index = 0; index < nbPokemiltons; index++) {
    pokemonChoices.push(new Pokemilton());
  }
  console.log(
    `Welcome ${master.name}, choose your first pokemilton to start your adventure:\n`
  );

  // list all the Pokemon randomly generated
  pokemonChoices.map((pokemon, index) =>
    console.log(
      `${index + 1}. ${pokemon.name} - Lvl: ${
        pokemon.level
      } - Stats: Attack Range: ${pokemon.attackRange} - Defense Range: ${
        pokemon.defenseRange
      } - PV: ${pokemon.healthPool} - Catch phrase: ${pokemon.catchPhrase}`
    )
  );

  try {
    const choiceNumber = await choiceDisplay(
      nbPokemiltons,
      `What is your choice ?`
    );
    const pokemonChoice = pokemonChoices[choiceNumber - 1];
    master.pokemiltonCollection.push(pokemonChoice);
    return pokemonChoice;
  } catch (error) {
    console.log(error);
  }

  return pokemonChoices;
}

function checkPokemonAbleToFight(pokemiltonMaster) {
  const pokemiltonsHealth = pokemiltonMaster.pokemiltonCollection
    .map((elem) => elem.healthPool)
    .reduce((acc, curr) => acc + curr);
  return pokemiltonsHealth > 0 ? true : false;
}

function averagePokemiltonLevel(pokemiltonMaster) {
  return Math.round(
    pokemiltonMaster.pokemiltonCollection
      .map((elem) => elem.level)
      .reduce((acc, curr) => acc + curr) /
      pokemiltonMaster.pokemiltonCollection.length
  );
}

async function choiceDisplay(nb, text) {
  let pattern = new RegExp(`^[1-${nb}]`);
  let length = nb.length;
  var result = false;
  let choiceNumber = "";
  do {
    choiceNumber = await rl.question(`\n${text} (1-${nb}) : `);
    choiceNumber.length > 1
      ? (result = false)
      : choiceNumber.match(pattern) == null
      ? (result = false)
      : (result = true);
    if (!result) {
      console.log(`Wrong choice`);
    }
  } while (result == false);
  return choiceNumber;
}

// ask for the world name to the user when creating a new game
async function newWorld() {
  try {
    const newWorldName = await rl.question(
      `How do you want to name your new world? `
    );
    const newWorld = new PokemiltonWorld(newWorldName);
    return newWorld;
  } catch (error) {
    console.log(error);
  }
}

async function startGame() {
  clear();
  let answer;
  const worldGame = await readFile();
  const worldGameNull = Object.keys(worldGame).length;
  try {
    console.log(
      chalk.blue(`
*** POKEMILTON MASTER ***
What do you want to do? 
1. Create a new game
2. Load the last save
3. Quit the game
------------------------------------------`)
    );
    answer = await choiceDisplay(3, `Your choice`);
  } catch (error) {
    console.log(error);
  }

  let choice = Number(answer);
  switch (choice) {
    case 1:
      // startNewGame();

      try {
        console.clear();
        console.log(`Welcome to the Pokemilton world!`);
        const pokemiltonWorld = await newWorld();
        const pokemiltonMaster = await askForName();
        console.clear();
        pokemiltonWorld.addLog(
          `Day ${pokemiltonWorld.day}: ${pokemiltonMaster.name} begins his adventure in the ${pokemiltonWorld.name} \n`
        );
        const nbFirstPokemiltons = 3;
        const pokemonChoice = await proposeFirstPokemilton(
          pokemiltonMaster,
          nbFirstPokemiltons
        );
        pokemiltonWorld.addLog(
          `Day ${pokemiltonWorld.day}: ${pokemiltonMaster.name} receives ${pokemonChoice.name}`
        );
        await rl.question("Type ENTER to continue...");
        clear();
        pokemiltonWorld.oneDayPasses();
        saveGameState(pokemiltonWorld, pokemiltonMaster);
        pokemiltonTown();
      } catch (error) {
        console.log(error);
      }
      break;
    case 2:
      try {
        if (worldGameNull == 0) {
          console.log("No game saved, you need to create a new world!");
          await rl.question("Type ENTER to continue...");
          clear();
          startGame();
          break;
        } else {
          clear();
          pokemiltonTown();
          break;
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      console.clear();
      console.log("bye bye");
      rl.close();
  }
}

startGame();

async function pokemiltonTown() {
  const worldGame = await readFile();
  let savedPokemiltonMaster = worldGame.PokemiltonMaster;
  let pokemiltonWorld = new PokemiltonWorld(worldGame.name);
  let savedPokemiltonWorld = {
    name: worldGame.name,
    day: worldGame.day,
    logs: worldGame.logs,
    saved_on: worldGame.saved_on,
  };
  pokemiltonWorld = Object.assign(pokemiltonWorld, savedPokemiltonWorld);
  let pokemiltonMaster = new PokemiltonMaster(savedPokemiltonMaster.name);
  pokemiltonMaster = Object.assign(pokemiltonMaster, savedPokemiltonMaster);
  let [logStatus, logText] = "";

  let answer;
  
    console.log(
      chalk.blue(
        chalk.underline(`
*** WORLD OF ${pokemiltonWorld.name.toUpperCase()} - DAY ${
          pokemiltonWorld.day
        } ***`)
      )
    );
    console.log(
      chalk.blue(`What do you want to do today ? 
1. Show all Pokemiltons
2. Heal a Pokemilton
3. Revive a Pokemilton
4. Release a Pokemilton
5. Rename a Pokemilton
6. Let's go for a walk...
7. Buy new items
8. Quit game
9. Reset all the progress
------------------------------------------`)
    );
    answer = await choiceDisplay(9, `Your choice`);
  

  answer = Number(answer);
  switch (answer) {
    case 1:
      pokemiltonMaster.showCollection();

      break;
    // Heal a pokemilton
    case 2:
      clear();
      if (pokemiltonMaster.pokemiltonCollection.length == 0) {
        console.log(
          "You have no Pokemilton left. Maybe you should start a new game?! Or maybe you are just too bad at dressing Pokemiltons?!\n"
        );
        await rl.question("Type ENTER to continue...");
        clear();
        startGame();
      } else {
        console.log("--- HEAL A POKEMILTON 🍗 ---");
        pokemiltonMaster.showCollectionHealth();
        try {
          const answer = await choiceDisplay(
            pokemiltonMaster.pokemiltonCollection.length,
            `Which Pokemilton do you want to heal? `
          );
          logText = await pokemiltonMaster.healPokemilton(answer - 1);
          pokemiltonWorld.addLog(`Day ${pokemiltonWorld.day}: ` + logText);
        } catch (error) {
          console.log(error);
        }
      }
      break;
    // Revive a pokemilton
    case 3:
      console.clear();
      if (pokemiltonMaster.pokemiltonCollection.length == 0) {
        console.log(
          "You have no Pokemilton left. Maybe you should start a new game?! Or maybe you are just too bad at dressing Pokemiltons?!\n"
        );
        await rl.question("Type ENTER to continue...");
        clear();
        startGame();
      } else {
        console.log("--- REVIVE A POKEMILTON 🍖 ---");
        pokemiltonMaster.showCollectionHealth();
        try {
          const answer = await choiceDisplay(
            pokemiltonMaster.pokemiltonCollection.length,
            `Which Pokemilton do you want to revive? `
          );

          logText = await pokemiltonMaster.revivePokemilton(answer - 1);
          pokemiltonWorld.addLog(`Day ${pokemiltonWorld.day}: ` + logText);
        } catch (error) {
          console.log(error);
        }
      }

      break;
    // Release a pokemilton
    case 4:
      console.clear();
      if (pokemiltonMaster.pokemiltonCollection.length == 0) {
        console.log(
          "You have no Pokemilton left. Maybe you should start a new game?! Or maybe you are just too bad at dressing Pokemiltons?!\n"
        );
        await rl.question("Type ENTER to continue...");
        clear();
        startGame();
      } else {
        console.log("--- RENAME A POKEMILTON ---");
        pokemiltonMaster.showCollection();
        try {
          const answer = await choiceDisplay(
            pokemiltonMaster.pokemiltonCollection.length,
            `Which Pokemilton do you want to release? `
          );

          let pokemiltonName =
            pokemiltonMaster.pokemiltonCollection[answer - 1].name;
          if (await pokemiltonMaster.releasePokemilton(answer - 1))
            console.clear();
          pokemiltonWorld.addLog(
            `Day ${pokemiltonWorld.day}: ${pokemiltonName} has been released into the wild! \n`
          );
        } catch (error) {
          console.log(error);
        }
      }

      break;
    // Rename a pokemilton
    case 5:
      console.clear();
      if (pokemiltonMaster.pokemiltonCollection.length == 0) {
        console.log(
          "You have no Pokemilton left. Maybe you should start a new game?! Or maybe you are just too bad at dressing Pokemiltons?!\n"
        );
      } else {
        try {
          pokemiltonMaster.showCollectionNameOnly();
          const answer = await choiceDisplay(
            pokemiltonMaster.pokemiltonCollection.length,
            `Which Pokemilton do you want to rename? `
          );

          let [previousName, newName] = await pokemiltonMaster.renamePokemilton(
            answer - 1
          );
          clear();
          pokemiltonWorld.addLog(
            `Day ${pokemiltonWorld.day}: ${previousName} changes name to ${newName} \n`
          );
        } catch (error) {
          console.log(error);
        }
      }

      break;
    // DO nothing... random event
    case 6:
      if (!pokemiltonWorld.randomizeEvent()) {
        pokemiltonWorld.oneDayPasses();
        saveGameState(pokemiltonWorld, pokemiltonMaster);
        const answer = await rl.question(`Continue (c) or quit the game (q)? `);
        // clear();
        if (answer == "c") {
          break;
        } else {
          console.log("close/quit game");
          rl.close();
          break;
        }
        // answer == "c" ? pokemiltonTown() : rl.close();
      } else {
        console.clear();
        // calculate the average level of all pokemilton's in the collection
        const averageLevel = averagePokemiltonLevel(pokemiltonMaster);

        let wildPokemilton = new Pokemilton(
          averageLevel - 1 == 0 ? 1 : averageLevel - 1,
          averageLevel + 1
        );

        pokemiltonWorld.addLog(
          chalk.red(
            `\nA wild ${wildPokemilton.name} appears!\nLvl:${
              wildPokemilton.level
            } - ❤️:${
              wildPokemilton.healthPool
            }\n${wildPokemilton.catchPhrase.toUpperCase()}`
          )
        );

        const answer = await rl.question(
          `Do you want to fight this Pokemilton? (y/n) `
        );

        if (answer == "y" && checkPokemonAbleToFight(pokemiltonMaster)) {
          let round = 1;
          let log;

          let validPokemon = true;
          let pokemiltonUser = new Pokemilton();
          do {
            pokemiltonMaster.showCollectionHealth();
            const answer = await choiceDisplay(
              pokemiltonMaster.pokemiltonCollection.length,
              `Choose your Pokemilton to fight against ${wildPokemilton.name}`
            );
            clear();

            pokemiltonUser = Object.assign(
              pokemiltonUser,
              pokemiltonMaster.pokemiltonCollection[answer - 1]
            );
            if (
              pokemiltonMaster.pokemiltonCollection.length > 1 &&
              pokemiltonUser.healthPool == 0
            ) {
              pokemiltonWorld.addLog(
                `${pokemiltonUser.name} is dead and cannot fight. Choose another Pokemilton from your collection`
              );
              validPokemon = false;
            } else {
              validPokemon = true;
            }
          } while (validPokemon == false);

          pokemiltonUser.sayCatchPhrase();
          let newArena = new PokemiltonArena(wildPokemilton, pokemiltonUser);
          do {
            answerBattle = await newArena.startBattle(
              pokemiltonWorld,
              pokemiltonMaster,
              round
            );
            switch (answerBattle) {
              // attack
              case 1:
                clear();
                pokemiltonWorld.addLog(`Round ${round}`);
                await newArena.attack(pokemiltonWorld, pokemiltonMaster, round);
                [logStatus, logText] = await newArena.checkBattleStatus(
                  pokemiltonUser,
                  wildPokemilton
                );
                pokemiltonWorld.addLog(logText);
                if (logStatus == 0) {
                  answerBattle = false;
                  round = 2;
                  break;
                } else {
                  answerBattle = true;
                  round++;
                }
                break;
              case 2:
                clear();
                const catchStatusFalse = await newArena.tryToCatch(
                  pokemiltonWorld,
                  pokemiltonMaster,
                  round
                );
                if (catchStatusFalse) {
                  round++;
                }
                [logStatus, logText] = await newArena.checkBattleStatus(
                  pokemiltonUser,
                  wildPokemilton
                );
                if (logStatus == 0) {
                  answerBattle = false;
                }
                pokemiltonWorld.addLog(logText);

                break;
              case 3:
                clear();
                pokemiltonWorld.addLog(`You run away from the battle!`);
                answerBattle = false;
                break;
              default:
                break;
            }
          } while (answerBattle == true);
          await newArena.endBattle(pokemiltonWorld, pokemiltonMaster, round);
        } else if (checkPokemonAbleToFight(pokemiltonMaster) == false) {
          pokemiltonWorld.addLog(
            chalk.black(chalk.bgRed("☠️☠️ All your Pokemiltons are dead!☠️☠️"))
          );
          break;
        } else {
          pokemiltonWorld.addLog(
            `${pokemiltonMaster.name} chose not to fight against ${wildPokemilton.name}.`
          );
        }
      }
      break;
    case 7:
      answer = await pokemiltonMaster.buyItems();
      answer = Number(answer);
      switch (answer) {
        case 1:
          logText = pokemiltonMaster.buyHealingItem();
          break;
        case 2:
          logText = pokemiltonMaster.buyRevivetem();
          break;
        case 3:
          logText = pokemiltonMaster.buyPokeball();
          break;
        default:
          break;
      }
      pokemiltonMaster.showItems();
      pokemiltonWorld.addLog(logText);
      break;
    // quit game
    case 8:
      clear();
      rl.close();
      break;
    // reset file
    case 9:
      deleteProgress();
      rl.close();
      break;
  }
  saveGameState(pokemiltonWorld, pokemiltonMaster);
  try {
    await rl.question("Type ENTER to continue...");
    console.clear();
    pokemiltonTown();
  } catch (error) {
    rl.close();
  }
}

// module.exports = pokemiltonTown;
