const jsonfile = require("jsonfile");
const fs = require("fs");
const didYouMean = require("didyoumean");
didYouMean.threshold = null;

class CharacterList {
  constructor(filename) {
    this.stats = ["Dexterity", "Strength", "Constitution", "Intelligence", "Wisdom", "Charisma"];//["Dexterity", "Agility", "Strength", "Size", "Endurance", "Perception", "Intelligence", "Wisdom", "Charisma", "Composure"];
    this.filename = filename;
    try {
      this.list = jsonfile.readFileSync(filename);
    }
    catch (err) {
      this.list = [];
    }
  }

  hasAdminPermission(user, character) {
    return user.admin || (character.creator === ("" + user.id));
  }

  hasPermission(user, character) {
    return this.hasAdminPermission(user, character) || character.access.indexOf("" + user.id) >= 0;
  }

  save() {
        fs.writeFile(this.filename, JSON.stringify(this.list, null, 4), "UTF8", (err) => console.log(err || "Successfully saved characters."));
  }

  delete(data) {
    let index = this.list.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    if (index < 0) {
      console.log("Tried to delete an invalid character!");
      return;
    }
    this.list.splice(index, 1);
    this.save();
  }

  add(data) {
    if (this.get(data.name)) {
      console.log("Tried to add duplicate character!");
      return;
    }
    if (data.name) {
      this.list.push(data);
      this.save();
    }
    else console.log("Tried to add a character with no name!");
  }

  rename(oldName, newName) {
    let index = this.list.findIndex((item) => item.name.toLowerCase() === oldName.toLowerCase());
    if (index < 0) {
      console.log("Tried to rename invalid character.");
      return;
    }
    this.list[index].name = newName;
    this.save();
  }

  update(data) {
    let index = this.list.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    if (index < 0)
      this.list.push(data);
    else
      this.list[index] = data;
    this.save();
  }

  match(name) {
    return name.match(/^(?:'?[0-9a-z]+(?:'[0-9a-z]+)*'?(?:(?:, |[ -])'?[0-9a-z]+(?:'[0-9a-z]+)*'?)*)$/i);
  }

  get(name) {
    return this.list.find((item) => item.name.toLowerCase() === name.toLowerCase());
  }

  search(name) {
    name = didYouMean(name, this.list, "name");
    if (name)
      return this.get(name);
    else return this.list[0];
  }
}
module.exports = CharacterList;
