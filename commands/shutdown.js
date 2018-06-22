const namespace = "commands.shutdown:";

module.exports = (message, context, data) => {
  if(!data.owners.includes(context.user.id)){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  setTimeout(()=>data.client.destroy().then(()=>process.exit(1)), 1000);
  data.addMessage(namespace + "success");
}
