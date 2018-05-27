const namespace = "commands.characters:";

module.exports = (message, context, data) => {
  data.addMessage(namespace + "start");
  let filtered = data.characters.list.filter((item) => data.characters.hasPermission(context.user, item));
  if(filtered.length > 0)
    data.addLines(namespace + "line", filtered);
  else{
    data.addMessage(namespace + "no-characters");
    return true;
  }
}
