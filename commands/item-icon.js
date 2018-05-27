const namespace = "commands.item-icon:";

module.exports = (message, context, data) => {
    if (!context.user.admin) {
        data.addMessage(namespace + "no-permission");
        return true;
    }
}