const namespace = "commands.characters.add-access:";

module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
  if(!data.characters.hasPermission(context.user, chara)){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  if(chara.access.includes(context.input.users[0].id)){
    data.addMessage(namespace + "already-existed");
    return true;
  }
  chara.access.push(context.input.users[0].id);
  data.characters.update(chara);
  data.addMessage(namespace + "success");
}
