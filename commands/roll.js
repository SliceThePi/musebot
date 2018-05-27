const anydice = require("anydice").AnyDice;

const namespace = "commands.roll:";

module.exports = (message, context, data) => {
  data.addMessage(namespace + "wait");
  anydice.run("output " + context.input.text)
    .then((result) => {
      context.output.text = "" + result.roll(result.first());
      data.reply(message, namespace + "success", context);
    }).catch((err) => {
      context.color = "#C02020";
      data.reply(message, namespace + "failure", context);
    });
}
