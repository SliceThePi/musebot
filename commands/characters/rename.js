module.exports = (message, context, data) => {
  if(!data.characters.hasAdminPermission(data.user, context.input.characters[0])){
    data.addMessage("commands.characters.rename:no-permission");
    return true;
  }
  context.output.characternames = [context.input.characters[0].name, context.input.characternames[0]];
  if(data.characters.get(context.input.characternames[0])){
    data.addMessage("commands.characters.rename:already-existed");
    return true;
  }
  data.characters.rename(context.input.characters[0].name, context.input.characternames[0]);
  data.addMessage("commands.characters.rename:success");
}
