var start_time,
    stop_time;

module.exports.start = function () {
    start_time = new Date().getTime();
};

module.exports.stop = function () {
    stop_time = new Date().getTime();
};

module.exports.get = function () {
    return stop_time - start_time;
};
