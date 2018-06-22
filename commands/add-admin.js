const namespace = "commands.add-admin:";

module.exports = (message, context, data) => {
  if(!data.owners.includes(context.user.id)){
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
