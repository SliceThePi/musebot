module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
	if(!chara.stats){
		chara.stats = {};
		for(let i = 0; i < data.characters.stats.length; i++)
			chara.stats[data.characters.stats[i]] = "0";
	}
  if(context.input.statpage){
    if(!data.characters.hasPermission(context.user, chara)){
      data.addMessage("commands.characters.stats:no-permission");
      return true;
    }
    let stats = [];
    Object.keys(context.input.statpage).forEach((item) => {
      stats.push({"stat": item, "value": chara.stats[item], "newvalue": context.input.statpage[item]});
      chara.stats[item] = context.input.statpage[item];
    });
    data.characters.update(chara);
    data.addMessage("commands.characters.stats:updated.start");
    data.addLines("commands.characters.stats:updated.line", stats);
    data.addMessage("commands.characters.stats:updated.end");
  } else {
    data.addMessage("commands.characters.stats:info.start");
    let stats = [];
    Object.keys(chara.stats).forEach((item) => stats.push({"stat": item, "value": chara.stats[item]}));
    data.addLines("commands.characters.stats:info.line", stats);
    data.addMessage("commands.characters.stats:info.end");
  }
}
