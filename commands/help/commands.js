module.exports = (message, context, data) => {
  if(context.input.commands.length == 1){
    data.addMessage("commands.help.commands:list.start");
    data.addLines("commands.help.commands:list.line", Object.keys(data.config.commands).filter((item) => data.config.commands[item].enabled));
    data.addMessage("commands.help.commands:list.end");
  } else {
    data.addMessage("commands.help.commands:usage.start");
    let path = context.input.commands[1].split(".");
    let config = data.config.commands;
    for(let i = 0; i < path.length; i++)
      config = config[path[i]];
    context.output = {"text": data.config.prefix + context.input.commands[1]};
    for(let i = 0; i < config.parameters.length; i++){
      context.output.text += " " + config.parameters[i];
    }
    data.addMessage("commands.help.commands:usage.parameter-list");
    data.addMessage("commands." + context.input.commands[1] + ":documentation");
    let subcommands = [];
    Object.keys(config).filter((item) => config[item].enabled).forEach((item) => subcommands.push(context.input.commands[1] + "." + item));
    if(subcommands.length > 0){
      data.addMessage("commands.help.commands:subcommands.start");
      data.addLines("commands.help.commands:list.line", subcommands);
      data.addMessage("commands.help.commands:subcommands.end");
    }
  }
}
