module.exports.assert = function (msg, test, value) {
    if (test === (value || true)) {
        console.log("ok", msg);
    } else {
        console.log("failed:", msg, test + " != " + value);
    }
};
