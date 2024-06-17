const { clear, log } = require('console');
var readline = require('readline/promises');
rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
});

class PokemiltonMaster {
	constructor(name) {
		this._POKEBALLPRICE = 10;
		this._HEALINGPRICE = 15;
		this._REVIVEPRICE = 5;
		this.name = name;
		this.pokemiltonCollection = [];
		this.money = 50;
		this.healingItems = 5; // Initial number of healing items
		this.reviveItems = 3; // Initial number of revive items
		this.POKEBALLS = 10; // Initial number of JOHNEBALLS
	}

	async renamePokemilton(pokemilton) {
		// let pattern = new RegExp(`\s[^a-zA-Z1-9]/g`);
		let previousName = this.pokemiltonCollection[pokemilton].name;
		let newName = await rl.question(
			`How do you want to rename ${previousName}? : `
		);
		newName = newName.replace(/[^a-zA-Z1-9]/g, '').replace(/\s+/g);
		this.pokemiltonCollection[pokemilton].name = newName;
		return [previousName, newName];
	}

	async healPokemilton(pokemiltonIndex) {
		let previousHealth = this.pokemiltonCollection[pokemiltonIndex].healthPool;
		if (this.healingItems <= 0) {
			console.clear();
			return `You do not have enough items to heal ${this.pokemiltonCollection[pokemiltonIndex].name}`;
		} else if (
			this.pokemiltonCollection[pokemiltonIndex].healthPool ===
			this.pokemiltonCollection[pokemiltonIndex].healthMax
		) {
			return `${this.pokemiltonCollection[pokemiltonIndex].name} is already to the max and do not need to be healed.`;
		}
		this.pokemiltonCollection[pokemiltonIndex].healthPool =
			this.pokemiltonCollection[pokemiltonIndex].healthMax;
		this.healingItems--;
		return `${this.pokemiltonCollection[pokemiltonIndex].name} has been healed (❤️: ${previousHealth} => ${this.pokemiltonCollection[pokemiltonIndex].healthPool}/${this.pokemiltonCollection[pokemiltonIndex].healthMax})!\n`;
	}

	async revivePokemilton(pokemiltonIndex) {
		let previousHealth = this.pokemiltonCollection[pokemiltonIndex].healthPool;
		if (this.reviveItems <= 0) {
			return `You do not have enough items to revive ${this.pokemiltonCollection[pokemiltonIndex].name}`;
		} else if (
			this.pokemiltonCollection[pokemiltonIndex].healthPool ===
			this.pokemiltonCollection[pokemiltonIndex].healthMax
		) {
			return `${this.pokemiltonCollection[pokemiltonIndex].name} is already to the max and do not need to be revived.`;
		} else if (
			this.pokemiltonCollection[pokemiltonIndex].healthPool >=
			Math.round(this.pokemiltonCollection[pokemiltonIndex].healthMax / 2)
		) {
			return `${this.pokemiltonCollection[pokemiltonIndex].name} is already at half of his health (❤️: ${this.pokemiltonCollection[pokemiltonIndex].healthPool}/${this.pokemiltonCollection[pokemiltonIndex].healthMax})!\n`;
		} else {
			this.pokemiltonCollection[pokemiltonIndex].healthPool = Math.round(
				this.pokemiltonCollection[pokemiltonIndex].healthMax / 2
			);
			this.reviveItems--;
			return `${this.pokemiltonCollection[pokemiltonIndex].name} has been revived (❤️: ${previousHealth} => ${this.pokemiltonCollection[pokemiltonIndex].healthPool}/${this.pokemiltonCollection[pokemiltonIndex].healthMax})! \n`;
		}
	}

	async releasePokemilton(pokemilton) {
		let pokeName = this.pokemiltonCollection[pokemilton].name;
		const answer = await rl.question(
			`Are you sure you want to release ${pokeName}? (Y/y): `
		);
		if (answer == `Y` || answer == 'y') {
			this.pokemiltonCollection = this.pokemiltonCollection.filter(
				(poke) => poke.name != pokeName
			);
			return true;
		} else {
			return false;
		}
	}

	async buyItems() {
		clear();
		this.showItems();
		console.log(
			`--- PRICELIST ---\n1. 🍗 Healing item - ${this._HEALINGPRICE}$\n2. 🍖 Revive item - ${this._REVIVEPRICE}$\n3. Pokeball - ${this._POKEBALLPRICE}$\n💰 Your wallet: ${this.money}$\n`
		);
		const answer = await rl.question(`What do you want to buy? (1-3): `);
		return answer;
	}

	buyHealingItem() {
		if (this.money < this._HEALINGPRICE) {
			return `You do not have enough money to buy a healing item 🍗`;
		} else {
			const previousMoney = this.money;
			const previsousItem = this.healingItems;
			this.money -= this._HEALINGPRICE;
			this.healingItems++;
			return `You bought an healing item 🍗: ${previsousItem} => ${this.healingItems} - 💰:${previousMoney} => ${this.money}`;
		}
	}

	buyRevivetem() {
		if (this.money < this._REVIVEPRICE) {
			return `You do not have enough money to buy a revive item 🍖.`;
		} else {
			const previousMoney = this.money;
			const previsousItem = this.reviveItems;
			this.money -= this._REVIVEPRICE;
			this.reviveItems++;
			return `You bought a revive item 🍖: ${previsousItem} => ${this.reviveItems} - 💰:${previousMoney} => ${this.money}`;
		}
	}

	buyPokeball() {
		if (this.money < this._POKEBALLPRICE) {
			return `You do not have enough money to buy a Pokeball`;
		} else {
			const previousMoney = this.money;
			const previsousItem = this.POKEBALLS;
			this.money -= this._POKEBALLPRICE;
			this.POKEBALLS++;
			return `You bought a Pokeball ${previsousItem} => ${this.POKEBALLS} - 💰:${previousMoney}$ => ${this.money}$`;
		}
	}

	showItems() {
		console.log(
			`\n--- LIST OF YOUR ITEMS ---\n1. 🍗 Healing item: ${this.healingItems}\n2. 🍖 Revive item: ${this.reviveItems}\n3. Pokeball: ${this.POKEBALLS}\n`
		);
	}

	showCollection() {
		clear();
		console.log(`\nList of all your Pokemiltons\n`);
		this.pokemiltonCollection.map((pokemilton, index) =>
			console.log(
				`${index + 1}. ${pokemilton.name} - Level: ${pokemilton.level} - ⚔️: ${
					pokemilton.attackRange
				} - 🛡️: ${pokemilton.defenseRange} - ❤️: ${pokemilton.healthPool}/${
					pokemilton.healthMax
				} - Catch phrase: ${pokemilton.catchPhrase} - 🦾:${
					pokemilton.experienceMeter
				}`
			)
		);
	}

	showCollectionHealth() {
		console.log(`\nList of all your Pokemiltons\n`);
		this.pokemiltonCollection.map((pokemilton, index) =>
			console.log(
				`${index + 1}. ${pokemilton.name} - Lvl: ${pokemilton.level} - ❤️: ${
					pokemilton.healthPool
				}/${pokemilton.healthMax}`
			)
		);
	}

	showCollectionNameOnly() {
		console.log(`\nList of all your Pokemiltons\n`);
		this.pokemiltonCollection.map((pokemilton, index) =>
			console.log(`${index + 1}. ${pokemilton.name}`)
		);
	}
}

module.exports = PokemiltonMaster;
