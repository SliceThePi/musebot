const namespace = "commands.add-admin:";

module.exports = (message, context, data) => {
  if(context.user.id != "105038157061337088"){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  if(context.input.users[0].admin){
    data.addMessage(namespace + "already-existed");
    return true;
  }
  context.input.users[0].admin = "true";
  data.updateUser(context.input.users[0]);
  data.addMessage(namespace + "success");
}
