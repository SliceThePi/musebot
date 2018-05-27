const Discord = require("discord.js");
const jsonfile = require("jsonfile");
const format = require("string-format");
const fs = require("fs");
const path = require("path");

const client = new Discord.Client();
const formatDate = require("./lib/format-date");

const config = jsonfile.readFileSync("./config.json");
const characters = new(require("./lib/character-list"))("./characters.json");
const magicitems = new(require("./lib/magic-item-list"))("./magic-items.json");

let users;
try {
  users = jsonfile.readFileSync("./users.json");
}
catch (err) {
  users = [];
}

function messages(namespace) {
  let current = config;
  let target = namespace.split(".");
  for (let i = 0; i < target.length && current; i++)
    current = current[target[i]];
  if (current && current.messages)
    return current.messages;
}

function translate(message, key, input) {
  try {
    let path = key.split(":");
    if (path.length != 2)
      return key;
    let current = messages(path[0]);
    if (!current)
      return key;
    let target = path[1].split(".");
    for (let i = 0; i < target.length && current; i++)
      current = current[target[i]];
    if (typeof current === "string")
      return format(current, input);
    else if (current instanceof Array) {
      let msg = "";
      for (let i = 0; i < current.length; i++) {
        msg += "\n" + format(current[i], input);
      }
      return msg.substring(1);
    }
    else return key;
  }
  catch (err) {
    return key;
  }
}

function reply() {
  let name;
  let context;
  let msg = arguments[1];
  if (msg.context) {
    context = msg.context;
  }
  else context = { "user": getUser(arguments[0].author.id) };

  if (msg.text)
    msg = msg.text;
  if (arguments.length == 2 && !arguments[1].context) {
    name = translate(arguments[0], "commands:running-unknown", context);
  }
  else if (arguments.length == 2 && arguments[1].context) {
    if (arguments[1].context.input && arguments[1].context.input.commands)
      name = translate(arguments[0], "commands:running", context);
    else
      name = translate(arguments[0], "commands:running-unknown", context);
  }
  else if (arguments.length == 3) {
    msg = translate(arguments[0], msg, arguments[2]);
    context = arguments[2];
    if (context.input && context.input.commands)
      name = translate(arguments[0], "commands:running", context);
    else
      name = translate(arguments[0], "commands:running-unknown", context);
  }
  arguments[0].channel.send(new Discord.RichEmbed({
    "author": {
      "name": name,
      "icon_url": arguments[0].author.avatarURL ? arguments[0].author.avatarURL : undefined
    },
    "thumbnail": context.thumbnail,
    "description": msg
  }).setColor(context.color || "#20C020")).catch((err) => console.log(err));
}

function getUser(id) {
  let user = users.find((item) => item.id === ("" + id));
  if (!user) {
    let internalUser = client.users.get("" + id);
    if (!internalUser)
      return;
    user = { "id": "" + id, "tag": internalUser.tag };
    updateUser(user);
  }
  else if (!user.tag) {
    let internalUser = client.users.get("" + id);
    if (!internalUser)
      return;
    user.tag = internalUser.tag;
    updateUser(user);
  }
  return user;
}

function updateUser(data) {
  let user = client.users.get(data.id);
  if (user && data.tag !== user.tag)
    data.tag = user.tag;
  let index = users.findIndex((item) => item.id === data.id);
  if (index < 0)
    users.push(data);
  else
    users[index] = data;
  jsonfile.writeFile("users.json", users, (err) => { console.log(err || "Successfully saved users."); });
}

/**
 * Mapping of parameter type names to their respective parsers.
 */
let parameters = {
  /**
   * A bot command. The user can input with command shorthand (aliases) and the
   * full command path will be added to the context.input.commands array.
   */
  "command": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "command";
      return false;
    }
    let match = context.text.match(/^([a-zA-Z]+(?:[\.-][a-zA-Z]+)*)(?:[ \n]([^]*))?$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.command";
      context.error = context.split(/[ \n]/)[0];
      return true;
    }
    let path = match[1].toLowerCase().split(".");
    let current = config.commands;
    if (!current.enabled) {
      context.errorkey = "commands:error.invalid.command";
      context.error = "(anything; commands are disabled)";
      return true;
    }
    let fullCommand = [];
    for (let i = 0; i < path.length; i++) {
      let keys = Object.keys(current);
      let found = false;
      for (let k = 0; k < keys.length && !found; k++)
        if (current[keys[k]].enabled && (path[i] === keys[k] || (current[keys[k]].aliases && current[keys[k]].aliases.includes(path[i])))) {
          fullCommand.push(keys[k]);
          found = true;
          current = current[keys[k]];
        }
      if (!found) {
        context.errorkey = "commands:error.invalid.command";
        context.error = match[1];
        return true;
      }
    }
    if (!context.input.commands)
      context.input.commands = [];
    context.input.commands.push(fullCommand.join("."));
    context.text = match[2];
    return true;
  },
  /**
   * Any amount of text, within quotes. The text will be added to the
   * context.input.quotedtexts array.
   */
  "quotedtext": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "text";
      return false;
    }
    let match = context.text.match(/^"((?:[^"]*(?:\\")?)*)"(?:[ \n]([^]*))?$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.quotedtext";
      return true;
    }
    if (!context.input.quotedtexts)
      context.input.quotedtexts = [];
    context.input.quotedtexts.push(match[1].replace(/\\"/g, "\""));
    context.text = match[2];
    return true;
  },
  /**
   * Any text. context.input.text will be set to the remainder of the buffer.
   */
  "text": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "text";
      return false;
    }
    context.input.text = context.text;
    context.text = undefined;
    return true;
  },
  /**
   * A valid character or item name, which will be added to the
   * context.input.names array.
   */
  "name": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "name";
      return false;
    }
    let match = context.text.match(/^"([0-9a-zA-Z']+(?:(?:,? |-)[0-9a-zA-Z']+)*)"(?:[ \n]([^]*))?$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.name";
      context.error = context.text;
      return true;
    }
    if (!characters.match(match[1])) {
      context.errorkey = "commands:error.invalid.name";
      context.error = match[1];
      return true;
    }
    if (!context.input.names)
      context.input.names = [];
    context.input.names.push(match[1]);
    context.text = match[2];
    return true;
  },
  /**
   * An existing character. The character's data entry will be added to the
   * context.input.characters array.
   */
  "character": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "character";
      return false;
    }
    let match = context.text.match(/^"([0-9a-zA-Z']+(?:(?:,? |-)[0-9a-zA-Z']+)*)"(?:[ \n]([^]*))?$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.name";
      context.error = context.text;
      return true;
    }
    if (!characters.match(match[1])) {
      context.errorkey = "commands:error.invalid.name";
      context.error = match[1];
      return true;
    }
    let chara = characters.get(match[1]);
    if (!chara) {
      context.errorkey = "commands:error.invalid.character";
      context.error = match[1];
      context.guess = characters.search(match[1]);
      return true;
    }
    if (!context.input.characters)
      context.input.characters = [];
    context.input.characters.push(chara);
    context.text = match[2];
    return true;
  },
  /**
   * A mapping of stats to values. The resultant object will be stored in
   * context.input.statpage
   */
  "statpage": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "statpage";
      return false;
    }
    let match = context.text.match(/^(?:[a-z]+):?(?:[ \n](?:[-\+]?\d+))(?:[ \n](?:[a-z]+):?(?:[ \n](?:[-\+]?\d+)))*$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.statpage";
      context.error = context.text;
      return true;
    }
    let output = {};
    let statArr = context.text.split(/[ \n]/g);
    for (let i = 0; i < statArr.length; i += 2) {
      let statName = statArr[i].replace(/:$/, "");
      let stat = characters.stats.find((item) => item.toLowerCase().startsWith(statName.toLowerCase()));
      if (statName.length >= 3 && stat) {
        let val = statArr[i + 1];
        if (val.match(/^[1-9]\d*$/))
          val = "+" + val;
        else if (val.match(/^(?:\+|-)?0+\d+$/))
          val = val.replace(/0+/, "");
        if (val.match(/^(?:\+|-)?$/))
          val = "0";
        output[stat] = val;
      }
    }
    context.input.statpage = output;
    context.input.statpagetext = JSON.stringify(output).replace(/,/g, "\n").replace(/["]/g, "");
    context.text = undefined;
    return true;
  },
  /**
   * An existing user. The user's data entry will be added to the
   * context.input.users array.
   */
  "user": (context) => {
    if (!context.text) {
      context.errorkey = "commands:error.missing-parameter";
      context.error = "user";
      return false;
    }
    let match = context.text.match(/^(?:<@!?(\d+)>|(\d+))(?:[ \n]([^]*))?$/);
    if (!match) {
      context.errorkey = "commands:error.invalid.user";
      context.error = context.text.split(/[ \n]/g)[0];
      return true;
    }
    let user = getUser(match[1] || match[2]);
    if (!user) {
      context.errorkey = "commands:error.invalid.user";
      context.error = match[1] || match[2];
      return true;
    }
    if (!context.input.users)
      context.input.users = [];
    context.input.users.push(user);
    context.text = match[3];
    return true;
  }
}

/**
 * Loads commands from a folder by using require(). A command's module.export
 * should be a function that takes three parameters and will return true upon
 * an error. Check the existing commands for examples of how to properly set
 * error messages.
 */
function loadCommands(obj, path) {
  let output = {};
  if (obj.enabled) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++)
      if (obj[keys[i]].enabled) {
        output[keys[i]] = loadCommands(obj[keys[i]], path + keys[i] + "/");
        try {
          output[keys[i]].run = require(path + keys[i]);
        }
        catch (err) { console.log("Didn't load " + path + keys[i]); }
      }
  }
  return output;
}

const commands = loadCommands(config.commands, "./commands/");

/**
 * Runs a command specified in config.json and optionally loaded from a file in
 * the ./commands/ directory.
 * First, a command context is created. This is just an object with data about
 * how the command is being used.
 * Then, to figure out what command was run, the "command" parameter parser is
 * run on the command context.
 * After that, each of the command's parameter parsers is run in order.
 * If the file corresponding to the command was found on boot-up, then the
 * function defined in that file will be run.
 * If the corresponding file was not found, the bot simply outputs all messages
 * found under the "messages" tag in the command's entry in config.json (with
 * the exception of the "documentation" message).
 * All command output is returned, along with the command context.
 */
function command(message) {
  let context = {
    "mention": message.author.toString(),
    "input": {},
    "output": {},
    "text": message.content.substring(config.prefix.length),
    "prefix": config.prefix,
    "user": getUser(message.author.id),
    "color": "#C02020"
  };
  let msg = { "text": "", "context": context };
  let addMessage = (key) => msg.text += "\n" + translate(message, key, context);
  let addLines = (key, arr) => {
    arr.forEach((item) => {
      context.line = item;
      addMessage(key);
    });
    delete context.line;
  };
  parameters.command(context);
  if (context.errorkey) {
    addMessage(context.errorkey);
    return msg;
  }
  let path = context.input.commands[0].split(".");
  let commandConfig = config.commands;
  let command = commands;
  for (let i = 0; i < path.length; i++) {
    command = command[path[i]];
    commandConfig = commandConfig[path[i]];
  }
  let params = commandConfig.parameters;
  for (let i = 0; i < params.length; i++) {
    let valid = false;
    if (params[i].match(/^\[[a-z]+\]$/)) {
      let name = params[i].substring(1, params[i].length - 1);
      let p = parameters[Object.keys(parameters).find((item) => item === name)];
      if (p) {
        let parsed = p(context);
        if (parsed && context.errorkey) {
          addMessage(context.errorkey);
          return msg;
        }
        valid = true;
      }
    }
    else if (params[i].match(/^<[a-z]+>$/)) {
      let name = params[i].substring(1, params[i].length - 1);
      let p = parameters[Object.keys(parameters).find((item) => item === name)];
      if (p) {
        let parsed = p(context);
        if (!parsed || context.errorkey) {
          addMessage(context.errorkey);
          return msg;
        }
        valid = true;
      }
    }
    if (!valid) {
      addMessage("commands:error.generic");
      return msg;
    }
  }
  if (command.run) {
    if (!command.run(message, context, {
        "characters": characters,
        "magicitems": magicitems,
        "users": users,
        "config": config,
        "commands": commands,
        "client": client,
        "getUser": getUser,
        "updateUser": updateUser,
        "reply": reply,
        "translate": translate,
        "addMessage": addMessage,
        "addLines": addLines
      }))
      delete context.color;
  }
  else {
    let msgs = messages("commands." + context.input.commands[0]) || [];
    let keys = Object.keys(msgs);
    for (let i = 0; i < keys.length; i++)
      if (keys[i] !== "documentation" && (typeof msgs[keys[i]] === "string" || msgs[keys[i]] instanceof Array))
        addMessage("commands." + context.input.commands[0] + ":" + keys[i]);
    delete context.color;
  }
  return msg;
}

client.on("ready", () => {
  console.log("Running bot");
});

client.on("message", (message) => {
  if (message.content.startsWith(config.prefix)) {
    console.log(formatDate(new Date()) + JSON.stringify(message.author.tag) + ": " + JSON.stringify(message.content));
    try {
      reply(message, command(message));
      //message.delete().catch((err)=> {});
    }
    catch (err) {
      reply(message, "commands:error.generic", { "user": getUser(message.author.id) || { "tag": "Error: Unknown User" }, "mention": message.author.toString() });
      console.error(err);
    }
  }
});
let token;
try {
  token = fs.readFileSync("token.txt", "UTF8");
  client.login(token);
}
catch (err) {
  console.error("Couldn't login! Did you fill out token.txt?");
  console.error(err);
  if (!token) {
    fs.writeFileSync("token.txt", "", "UTF8");
  }
  process.exit(1);
}
