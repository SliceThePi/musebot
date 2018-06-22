const namespace = "commands.reboot:";

module.exports = (message, context, data) => {
  if(!data.owners.includes(context.user.id)){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  setTimeout(()=>data.client.destroy().then(()=>process.exit()), 1000);
  console.log("Rebooting.");
  data.addMessage(namespace + "success");
}
