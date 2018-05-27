const namespace = "commands.help.commands:";

module.exports = (message, context, data) => {
  if(context.input.commands.length == 1){
    data.addMessage(namespace + "list.start");
    data.addLines(namespace + "list.line", Object.keys(data.config.commands).filter((item) => data.config.commands[item].enabled));
    data.addMessage(namespace + "list.end");
  } else {
    data.addMessage(namespace + "usage.start");
    let path = context.input.commands[1].split(".");
    let config = data.config.commands;
    for(let i = 0; i < path.length; i++)
      config = config[path[i]];
    context.output = {"text": data.config.prefix + context.input.commands[1]};
    for(let i = 0; i < config.parameters.length; i++){
      context.output.text += " " + config.parameters[i];
    }
    data.addMessage(namespace + "usage.parameter-list");
    data.addMessage("commands." + context.input.commands[1] + ":documentation");
    let subcommands = [];
    Object.keys(config).filter((item) => config[item].enabled).forEach((item) => subcommands.push(context.input.commands[1] + "." + item));
    if(subcommands.length > 0){
      data.addMessage(namespace + "subcommands.start");
      data.addLines(namespace + "list.line", subcommands);
      data.addMessage(namespace + "subcommands.end");
    }
  }
}
