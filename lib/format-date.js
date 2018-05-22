
//edited from https://stackoverflow.com/a/36887315/8947123
function formatDate (date) {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let milliseconds = date.getMilliseconds();

    return "[" +
           (hour < 10 ? "0" + hour : hour) +
           ":" +
           (minutes < 10 ? "0" + minutes : minutes) +
           ":" +
           (seconds < 10 ? "0" + seconds : seconds) +
           "." +
           ("00" + milliseconds).slice(-3) +
           "] ";
}

module.exports = formatDate;