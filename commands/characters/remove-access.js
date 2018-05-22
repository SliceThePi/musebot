module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
  if(!data.characters.hasPermission(context.user, chara)){
    data.addMessage("commands.characters.remove-access:no-permission");
    return true;
  }
  if(!chara.access.includes(context.input.users[0].id)){
    data.addMessage("commands.characters.remove-access:did-not-exist");
    return true;
  }
  chara.access.splice(chara.access.indexOf(context.input.users[0].id), 1);
  data.characters.update(chara);
  data.addMessage("commands.characters.remove-access:success");
}
