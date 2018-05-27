const namespace = "commands.magic-item:";

module.exports = (message, context, data) => {

<<<<<<< HEAD
    if (context.input.names) {
        if (context.input.quotedtexts) {
=======
    if (context.input.quotedtexts) {
        if (context.input.quotedtexts.length == 2) {
>>>>>>> 1e6568e6e58782a335398d27cb390a0d7265b2cb
            if (!context.user.admin) {
                data.addMessage(namespace + "no-permission");
                return true;
            }
<<<<<<< HEAD
            data.magicitems.create(context.input.names[0], context.input.quotedtexts[0]);
=======
            data.magicitems.create(context.input.quotedtexts[0], context.input.quotedtexts[1]);
>>>>>>> 1e6568e6e58782a335398d27cb390a0d7265b2cb
            data.addMessage(namespace + "created");
        }
        else {
            data.addMessage(namespace + "start");
<<<<<<< HEAD
            let item = data.magicitems.search(context.input.names[0]);
            context.output.names = [item.name]
            context.output.quotedtexts = [item.description];
=======
            let item = data.magicitems.search(context.input.quotedtexts[0]);
            context.output.quotedtexts = [item.name, item.description];
>>>>>>> 1e6568e6e58782a335398d27cb390a0d7265b2cb
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
<<<<<<< HEAD
        context.output.names = [item.name]
        context.output.quotedtexts = [item.description];
=======
        context.output.quotedtexts = [item.name, item.description];
>>>>>>> 1e6568e6e58782a335398d27cb390a0d7265b2cb
        data.addMessage(namespace + "success");
    }
}
