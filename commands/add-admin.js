module.exports = (message, context, data) => {
  if(("" + message.guild.ownerID) !== context.user.id){
    data.addMessage("commands.add-admin:no-permission");
    return true;
  }
  if(context.input.users[0].admin){
    data.addMessage("commands.add-admin:already-existed");
    return true;
  }
  context.input.users[0].admin = "true";
  data.updateUser(context.input.users[0]);
  data.addMessage("commands.add-admin:success");
}
