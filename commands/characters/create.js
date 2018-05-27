const namespace = "commands.characters.create:";

module.exports = (message, context, data) => {
  if(data.characters.get(context.input.names[0])){
    data.addMessage(namespace + "error.existing-character");
    return true;
  }
  let chara = {
    "name": context.input.names[0],
    "creator": context.user.id,
    "access": []
  };
  data.characters.add(chara);
  context.output.characters = [chara];
  data.addMessage(namespace + "success");
}
