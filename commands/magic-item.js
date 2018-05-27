const namespace = "commands.magic-item:";

module.exports = (message, context, data) => {

    if (context.input.quotedtexts) {
        if (context.input.quotedtexts.length == 2) {
            if (!context.user.admin) {
                data.addMessage(namespace + "no-permission");
                return true;
            }
            data.magicitems.create(context.input.quotedtexts[0], context.input.quotedtexts[1]);
            data.addMessage(namespace + "created");
        }
        else {
            data.addMessage(namespace + "start");
            let item = data.magicitems.search(context.input.quotedtexts[0]);
            context.output.quotedtexts = [item.name, item.description];
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
        context.output.quotedtexts = [item.name, item.description];
        data.addMessage(namespace + "success");
    }
}
