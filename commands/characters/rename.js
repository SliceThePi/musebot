const namespace = "commands.characters.rename:";

module.exports = (message, context, data) => {
  if(!data.characters.hasAdminPermission(context.user, context.input.characters[0])){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  context.output.names = [context.input.characters[0].name, context.input.names[0]];
  if(data.characters.get(context.input.names[0])){
    data.addMessage(namespace + "already-existed");
    return true;
  }
  data.characters.rename(context.input.characters[0].name, context.input.names[0]);
  data.addMessage(namespace + "success");
}
