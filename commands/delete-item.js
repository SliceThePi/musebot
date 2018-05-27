const namespace = "commands.delete-item:";

module.exports = (message, context, data) => {
    if (!context.user.admin) {
        data.addMessage(namespace + "no-permission");
        return true;
    }
    let item = data.magicitems.remove(context.input.names[0]);
    if (item) {
        context.output.quotedtexts = [item.name, item.description];
        data.addMessage(namespace + "success");
    }
    else {
        data.addMessage(namespace + "invalid-item");
        return true;
    }
}
