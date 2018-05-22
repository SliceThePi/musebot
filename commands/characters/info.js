module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
  context.output.users = [data.getUser(chara.creator)];
  data.addMessage("commands.characters.info:start");
  if(chara.access.includes(chara.creator)){
    chara.access.splice(chara.access.indexOf(chara.creator), 1);
    data.characters.update(chara);
  }
  let users = [];
  users.push(data.getUser(chara.creator));
  chara.access.forEach((item) => users.push(data.getUser(item)));
  data.addLines("commands.characters.info:line", users);
  data.addMessage("commands.characters.info:end");
}
