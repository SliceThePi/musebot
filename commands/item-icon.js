const namespace = "commands.item-icon:";

module.exports = (message, context, data) => {
    if (!context.user.admin) {
        data.addMessage(namespace + "no-permission");
        return true;
    }
    let item = data.magicitems.get(context.input.names[0]);
    if (item) {
        data.magicitems.icon(context.input.names[0], context.quotedtexts[0]);
        context.output.names = [item.name];
        data.addMessage(namespace + "success");
    }
    else {
        data.addMessage(namespace + "invalid-item");
        return true;
    }
}
