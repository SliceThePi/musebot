const childprocess = require("child_process");

function run() {
    childprocess.spawn(process.argv[0], ["bot.js"], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
    }).on("exit", (code) => {
        if(code == 0)
            run();
        else
            console.log("Shutting down!");
    });
}

run();