module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
  if(!data.characters.hasPermission(context.user, chara)){
    data.addMessage("commands.characters.add-access:no-permission");
    return true;
  }
  if(chara.access.includes(context.input.users[0].id)){
    data.addMessage("commands.characters.add-access:already-existed");
    return true;
  }
  chara.access.push(context.input.users[0].id);
  data.characters.update(chara);
  data.addMessage("commands.characters.add-access:success");
}
