const anydice = require("anydice").AnyDice;
module.exports = (message, context, data) => {
  data.addMessage("commands.roll:wait");
  anydice.run("output " + context.input.text)
    .then((result) => {
      context.output.text = "" + result.roll(result.first());
      data.reply(message, "commands.roll:success", context);
    }).catch((err) => {
      context.color = "#C02020";
      data.reply(message, "commands.roll:failure", context);
    });
}
