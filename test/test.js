
var IndexedArray = require("../lib/index"),
    timer = require("./timer"),
    assert = require("./assert").assert;

// test data

var data = [
  { name: "Alf" },
  { name: "Gabi" },
  { name: "Lars" },
  { name: "Fran" },
  { name: "Juli" },
  { name: "Gorka" },
  { name: "Bruce" },
  { name: "Ale" }
];

// test: invalid index property
try {
    ia = new IndexedArray(data, "invalid");
    assert("ia allowed invalid index", true);
} catch (e) {
    assert("ia creation failed with invalid index", true);
}

// test: invalid data
try {
    ia = new IndexedArray("no-data", "invalid");
    assert("ia allowed invalid data", true);
} catch (e) {
    assert("ia creation failed with invalid data", true);
}

// test: create ia
var ia = new IndexedArray(data, "name");
assert("ia is object", typeof ia, "object");
assert("ia is IndexedArray", ia instanceof IndexedArray);

// test: sort
var ret = ia.sort();
assert("ia min val is Ale", ia.minv, "Ale");
assert("ia mxn val is Lars", ia.maxv, "Lars");
assert("ia sort can be chained", ret, ia);

// test: find one
var one = "Gabi",
    obj = ia.get(one);
assert("ia get retrieved " + one, obj.name, one);

// test: fine another
one = "Juli";
obj = ia.get(one);
assert("ia get retrieved " + one, obj.name, one);

// test: find the first again
one = "Gabi";
obj = ia.get(one);
assert("ia get retrieved " + one + " again", obj.name, one);

// test: find lower boundary
one = "Ale";
obj = ia.get(one);
assert("ia get retrieved " + one, obj.name, one);

// test: find higher boundary
one = "Lars";
obj = ia.get(one);
assert("ia get retrieved " + one, obj.name, one);

// test: fetch position
one = "Bruce";
ret = ia.fetch(one);
assert("ia fetched " + one, ret.last, 2);

// test: chain fetch and get
one = "Bruce";
obj = ia.fetch(one).get();
assert("ia fetch.get retrieved " + one, obj.name, one);

// test: search non existent
one = "Herman";
obj = ia.get(one);
assert("ia could not get " + one, !obj);

// test: get lower nearest non-match within range
obj = ia.get(one, true);
assert("ia got lower than " + one, obj.name, "Gorka");

// test: get lower nearest non-match within range not from cache
one = "Fer";
obj = ia.get(one, true);
assert("ia got lower than " + one, obj.name, "Bruce");

// test: search non existent again
one = "Herman";
obj = ia.get(one);
assert("ia could not get " + one + " again", !obj);

// test: get lower nearest within range again
obj = ia.get(one, true);
assert("ia got lower than " + one + " again", obj.name, "Gorka");

// test: search out of range lower
one = "Aaron";
obj = ia.get(one);
assert("ia could not get " + one, !obj);

// test: get lower nearest oor-
obj = ia.get(one, true);
assert("ia could not get lower than " + one, !obj);

// test: search out of range highrt
one = "Zak";
obj = ia.get(one);
assert("ia could not get " + one, !obj);

// test: get lower nearest oor+
obj = ia.get(one, true);
assert("ia got lower than " + one, obj.name, "Lars");

// test: slice including values wr, oor--, oor-wr, wroor+, oor++
obj = ia.getRange("Aadvark", "Aaron"); // below, below
assert("ia could not get range", !obj);

obj = ia.getRange("Aadvark", "Bruce"); // below, ok
assert("ia could not get range", !obj);

obj = ia.getRange("Aadvark", "Herman"); // below, not
assert("ia could not get range", !obj);

obj = ia.getRange("Aadvark", "Zak"); // below, above
assert("ia could not get range", !obj);

obj = ia.getRange("Bruce", "Gorka"); // ok, ok
assert("ia got range within data", obj.length, 4);

obj = ia.getRange("Bruce", "Herman"); // ok, not
assert("ia could not get range", !obj);

obj = ia.getRange("Bruce", "Zak"); // ok, above
assert("ia could not get range", !obj);

obj = ia.getRange("Herman", "Lars"); // not, ok
assert("ia could not get range", !obj);

obj = ia.getRange("Herman", "John"); // not, not
assert("ia could not get range", !obj);

obj = ia.getRange("Herman", "Zak"); // not, above
assert("ia could not get range", !obj);

obj = ia.getRange("Yesi", "Zak"); // above, above
assert("ia could not get range", !obj);

// test: slice including lower nearest wr, oor--, oor-wr, wroor+, oor++
obj = ia.getRange("Aadvark", "Aaron", true); // below, below
assert("ia could not get range bb", !obj);

obj = ia.getRange("Aadvark", "Bruce", true); // below, ok
assert("ia got range bo", obj.length, 3);

obj = ia.getRange("Aadvark", "Herman", true); // below, not
assert("ia got range nb", obj.length, 6);

obj = ia.getRange("Aadvark", "Zak", true); // below, above
assert("ia got range ba", obj.length, 8);

obj = ia.getRange("Bruce", "Gorka", true); // ok, ok
assert("ia got range oo", obj.length, 4);

obj = ia.getRange("Bruce", "Herman", true); // ok, not
assert("ia got range on", obj.length, 4);

obj = ia.getRange("Bruce", "Zak", true); // ok, above
assert("ia got range oa", obj.length, 6);

obj = ia.getRange("Herman", "Juli", true); // not, ok
assert("ia got range no", obj.length, 2);

obj = ia.getRange("Herman", "John", true); // not, not
assert("ia got range nn", obj.length, 1);

obj = ia.getRange("Herman", "Zak", true); // not, above
assert("ia got range na", obj.length, 3);

obj = ia.getRange("Yesi", "Zak", true); // above, above
assert("ia got range aa", obj.length, 1);

// test: slice with inverted indexes
obj = ia.getRange("Gorka", "Bruce", true);
assert("ia could not get range", !obj);

// test: find with numeric index
ia = new IndexedArray([{ num: 1 }, { num: 2 }, { num: 5 }], "num");
var val = 2;
obj = ia.get(val);
assert("ia get retrieved " + val, obj.num, val);

// test: custom compare function

// test: custom search function
