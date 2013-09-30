/**
 * Indexed Array Binary Search module
 */

/**
 * Dependencies
 */
var util = require("./util"),
    cmp = require("./compare"),
    bin = require("./search/binary");

/**
 * Module interface definition
 */
module.exports = IndexedArray;

/**
 * Indexed Array constructor
 *
 * It loads the array data, defines the index field and the comparison function
 * to be used.
 *
 * @param {Array} data is an array of objects
 * @param {String} index is the object's property used to search the array
 */
function IndexedArray(data, index) {

    // is data sortable array or array-like object?
    if (!util.isSortableArrayLike(data))
        throw new Error("Invalid data");

    // is index a valid property?
    if (!index || data.length > 0 && !(index in data[0]))
        throw new Error("Invalid index");

    // data array
    this.data = data;

    // name of the index property
    this.index = index;

    // get index boundary values
    this.minv = data.length && data[0][index];
    this.maxv = data.length && data[data.length - 1][index];

    // default comparison function
    this.compare = typeof this.minv === "number" ? cmp.numcmp : cmp.strcmp;

    // default search function
    this.search = bin.search;

    // cache of index values to array positions
    // each value stores an object as { found: true|false, index: array-index }
    this.valpos = {};
}

/**
 * Set the comparison function
 *
 * @param {Function} fn to compare index values that returnes 1, 0, -1
 */
IndexedArray.prototype.setCompare = function (fn) {
    if (typeof fn !== "function")
        throw new Error("Invalid argument");

    this.compare = fn;
    return this;
};

/**
 * Set the search function
 *
 * @param {Function} fn to search index values in the array of objects
 */
IndexedArray.prototype.setSearch = function (fn) {
    if (typeof fn !== "function")
        throw new Error("Invalid argument");

    this.search = fn;
    return this;
};

/**
 * Sort the data array by its index property
 */
IndexedArray.prototype.sort = function () {
    var self = this,
        data = this.data,
        index = this.index;

    // sort the array
    this.data.sort(function (a, b) {
        return self.compare(a[index], b[index]);
    });

    // recalculate boundary values
    this.minv = data.length && data[0][index];
    this.maxv = data.length && data[data.length - 1][index];

    return this;
};

/**
 * Get the position of the object corresponding to the given index
 *
 * @param {Number|String} index is the id of the requested object
 * @param {Boolean} [optional] return the item itself or the nearest lower one
 * @returns {Number} the position of the object in the array
 */
IndexedArray.prototype.fetch = function (value, orprev) {
    // check data has objects
    if (this.data.length === 0) {
        this.last = null;
        return this;
    }

    // check the request is within range
    if (this.compare(value, this.minv) === -1) {
        this.last = null;
        return this;
    }
    if (this.compare(value, this.maxv) === 1) {
        this.last = orprev && (this.data.length - 1) || null;
        return this;
    }

    var valpos = this.valpos,
        pos = valpos[value],
        last;

    if (pos) {
        // if the request is memorized, just give it or prev back
        last = pos.found ? pos.index : orprev && pos.prev || null;
    } else {
        // or do the actual search
        last = this.search.call(this, value);
        // return prev if not found and requested
        if (last === null && orprev)
            last = valpos[value].prev;
    }

    this.last = last;
    return this;
};

/**
 * Get the object corresponding to the given index
 *
 * When no value is given, the function will default to the last fetched item.
 *
 * @param {Number|String} [optional] index is the id of the requested object
 * @param {Boolean} [optional] oprpev allows getting the item or the lower one
 * @returns {Object} the found object or null
 */
IndexedArray.prototype.get = function (value, orprev) {
    if (value)
        this.fetch(value, orprev);

    var pos = this.last;
    return pos !== null ? this.data[pos] : null;
};

/**
 * Get an slice of the data array
 *
 * Boundaries have to be in order.
 *
 * When the request is aprox'ed, the boundaries not found default to the lower
 * entry. If the begin boundary falls out of range, it defaults to the
 * beginning.
 *
 * @param {Number|String} begin index is the id of the requested object
 * @param {Number|String} end index is the id of the requested object
 * @param {Boolean} [optional] aprox enables aprox'ed mode
 * @returns {Object} the slice of data array or null
 */
IndexedArray.prototype.getRange = function (begin, end, aprox) {
    // boundaries in order?
    if (this.compare(begin, end) === 1)
        return null;

    // start search
    var start = this.fetch(begin, aprox).last;
    var finish = this.fetch(end, aprox).last;

    // if start is below range and aprox search, set to 0
    if (start === null && aprox)
        start = 0;

    // if any boundary is not set, return no range
    if (start === null || finish === null)
        return null;

    // return range
    return this.data.slice(start, finish + 1);
};
