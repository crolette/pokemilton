const fs = require("fs");
const { unlinkSync } = require("fs");
const path = "./save.json";

// read the file and returns the objects == tasksList
async function readFile() {
  try {
    worldGame = fs.readFileSync(path);
    worldGame = JSON.parse(worldGame);
    return worldGame;
  } catch (error) {
    console.log(error);
  }
}

// TODO check if file not empty
// create if the file exists
function checkIfFileExists() {
  return fs.existsSync(path);
}

function deleteProgress(path) {
  try {
    fs.unlinkSync(path);

    console.log("Delete File successfully.");
  } catch (error) {
    console.log(error);
  }
}

// create the file with an empty array
function createFile() {
  fs.writeFile(path, "{}", function (err) {
    if (err) throw err;
  });
}
// function to write the new tasks list in the file
function writeFile(saveGame) {
  try {
    fs.writeFileSync(path, JSON.stringify(saveGame, null, 2), (file) =>
      console.log(file)
    );
  } catch (error) {
    console.log("An error has occurred ", error);
  }
}

function checkSave() {
  return checkIfFileExists()
    ? readFile()
    : console.log("No game saved, you need to create a new world!");
}

// save current game state
function saveGameState(world, PokemiltonMaster) {
  const date = { saved_on: new Date() };
  let master = { PokemiltonMaster };
  let saveGame = {};
  saveGame = Object.assign(saveGame, master, world, date);
  writeFile(saveGame);
  // console.log(`--- Game progress saved ---\n`);
}

module.exports = {
  readFile,
  checkIfFileExists,
  createFile,
  writeFile,
  checkSave,
  deleteProgress,
  saveGameState,
};
