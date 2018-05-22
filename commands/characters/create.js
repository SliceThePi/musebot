module.exports = (message, context, data) => {
  if(data.characters.get(context.input.characternames[0])){
    data.addMessage("commands.characters.create:error.existing-character");
    return true;
  }
  let chara = {
    "name": context.input.characternames[0],
    "creator": context.user.id,
    "access": []
  };
  data.characters.add(chara);
  context.output.characters = [chara];
  data.addMessage("commands.characters.create:success");
}
