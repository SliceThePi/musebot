const namespace = "commands.reboot:";

module.exports = (message, context, data) => {
  if(context.user.id != "105038157061337088"){
    data.addMessage(namespace + "no-permission");
    return true;
  }
  setTimeout(()=>data.client.destroy().then(()=>process.exit()), 1000);
  console.log("Rebooting.");
  data.addMessage(namespace + "success");
}
