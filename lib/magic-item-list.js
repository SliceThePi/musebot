const jsonfile = require("jsonfile");
const fs = require("fs");
const didYouMean = require("didyoumean");
didYouMean.threshold = null;

class MagicItemList {
    constructor(filename) {
        this.filename = filename;
        try {
            this.list = jsonfile.readFileSync(filename);
        }
        catch (err) {
            this.list = [];
        }
    }

    icon(name, url) {
        let index = this.list.findIndex((item) => item.name.toLowerCase() == name.toLowerCase());
        if (index >= 0) {
            if (url)
                this.list[index].thumbnail = url;
            else
                delete this.list[index].thumbnail;
            this.save();
        }
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

    create(name, description) {
        this.list.push({ "name": name, "description": description });
        this.save();
    }

    remove(name) {
        let index = this.list.findIndex((item) => item.name.toLowerCase() == name);
        if (index >= 0) {
            let item = this.list.splice(index, 1)[0];
            this.save();
            return item;
        }
    }

    size() {
        return this.list.length;
    }

    getRandom() {
        return this.list[Math.floor(this.list.length * Math.random())];
    }

    save() {
        fs.writeFile(this.filename, JSON.stringify(this.list, null, 4), "UTF8", (err) => console.log(err || "Successfully saved magic items."));
    }
}

module.exports = MagicItemList;
