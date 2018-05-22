module.exports = (message, context, data) => {
  data.addMessage("commands.characters:start");
  let filtered = data.characters.list.filter((item) => data.characters.hasPermission(context.user, item));
  if(filtered.length > 0)
    data.addLines("commands.characters:line", filtered);
  else{
    data.addMessage("commands.characters:no-characters");
    return true;
  }
}
