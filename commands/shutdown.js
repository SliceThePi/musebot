const namespace = "commands.shutdown:";

module.exports = (message, context, data) => {
  if(context.user.id != "105038157061337088"){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  setTimeout(()=>data.client.destroy().then(()=>process.exit(1)), 1000);
  data.addMessage(namespace + "success");
}
