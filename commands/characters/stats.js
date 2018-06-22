const namespace = "commands.characters.stats:"

module.exports = (message, context, data) => {
  let chara = context.input.characters[0];
  if (!chara.stats) {
    chara.stats = {};
    data.characters.stats.forEach((item) => chara.stats[item] = "10");
  }
  if (context.input.statpage) {
    if (!data.characters.hasPermission(context.user, chara)) {
      data.addMessage(namespace + "no-permission");
      return true;
    }
    let stats = [];
    Object.keys(context.input.statpage).forEach((item) => {
      stats.push({ "stat": item, "value": chara.stats[item], "newvalue": context.input.statpage[item] });
      chara.stats[item] = context.input.statpage[item];
    });
    data.characters.update(chara);
    data.addMessage(namespace + "updated.start");
    data.addLines(namespace + "updated.line", stats);
    data.addMessage(namespace + "updated.end");
  }
  else {
    data.addMessage(namespace + "info.start");
    let stats = [];
    Object.keys(chara.stats).forEach((item) => stats.push({ "stat": item, "value": chara.stats[item] }));
    data.addLines(namespace + "info.line", stats);
    data.addMessage(namespace + "info.end");
  }
}
