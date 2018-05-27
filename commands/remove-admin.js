const namespace = "commands.remove-admin:";

module.exports = (message, context, data) => {
  if(context.user.id != "105038157061337088"){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  if(!context.input.users[0].admin){
    data.addMessage(namespace + "did-not-exist");
    return true;
  }
  delete context.input.users[0].admin;
  data.updateUser(context.input.users[0]);
  data.addMessage(namespace + "success");
}
