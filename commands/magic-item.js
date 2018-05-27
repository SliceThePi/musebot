const namespace = "commands.magic-item:";

module.exports = (message, context, data) => {

    if (context.input.names) {
        if (context.input.quotedtexts) {
            if (!context.user.admin) {
                data.addMessage(namespace + "no-permission");
                return true;
            }
            data.magicitems.create(context.input.names[0], context.input.quotedtexts[0]);
            data.addMessage(namespace + "created");
        }
        else {
            data.addMessage(namespace + "start");
            let item = data.magicitems.search(context.input.names[0]);
            context.output.names = [item.name]
            context.output.quotedtexts = [item.description];
            context.thumbnail = { "url": item.thumbnail };
            data.addMessage(namespace + "success");
        }
    }
    else {
        data.addMessage(namespace + "start");
        if (data.magicitems.size() == 0) {
            data.addMessage(namespace + "no-items");
            return true;
        }
        let item = data.magicitems.getRandom();
        context.output.names = [item.name]
        context.output.quotedtexts = [item.description];
        context.thumbnail = { "url": item.thumbnail };
        data.addMessage(namespace + "success");
    }
}
