/**
 * ArraySlicer tests
 *
 * Uses mocha/TDD and chai/assert
 */

/* global suite, setup, test, teardown */

var IndexedArray = require("../lib/index"),
    assert = require("chai").assert;

suite("Create", function () {

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

  test("with invalid index property", function () {
    var getIA = function () {
      new IndexedArray(data, "invalid");
    };
    assert.throw(getIA, Error, "Invalid index");
  });

  test("with invalid data", function () {
    var getIA = function () {
      new IndexedArray("no-data", "invalid");
    };
    assert.throw(getIA, Error, "Invalid data");
  });

  test("IA from data", function () {
    var ia = new IndexedArray(data, "name");
    assert.typeOf(ia, "object");
    assert.instanceOf(ia, IndexedArray);
  });

  test("IA from an empty array", function () {
    var ia = new IndexedArray([], "name");
    assert.typeOf(ia, "object");
    assert.instanceOf(ia, IndexedArray);
  });

});

suite("Sort array", function () {

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
  var ia = new IndexedArray(data, "name");

  test("of unsorted data", function () {
    var ret = ia.sort();
    assert.strictEqual(ia.minv, "Ale");
    assert.strictEqual(ia.maxv, "Lars");
    assert.instanceOf(ret, IndexedArray);
  });

});

suite("Get and fetch", function () {

  // test data
  var data = [
    { name: "Ale" },
    { name: "Alf" },
    { name: "Bruce" },
    { name: "Fran" },
    { name: "Gabi" },
    { name: "Gorka" },
    { name: "Juli" },
    { name: "Lars" }
  ];
  var ia = new IndexedArray(data, "name");

  test("one value", function () {
    var one = "Gabi",
        obj = ia.get(one);
    assert.strictEqual(obj.name, one);
  });

  test("another", function () {
    var one = "Juli",
        obj = ia.get(one);
    assert.strictEqual(obj.name, one);
  });

  test("the first again", function () {
    var one = "Gabi",
        obj = ia.get(one);
    assert.strictEqual(obj.name, one);
  });

  test("lower boundary", function () {
    var one = "Ale",
        obj = ia.get(one);
    assert.strictEqual(obj.name, one);
  });

  test("higher boundary", function () {
    var one = "Lars",
        obj = ia.get(one);
    assert.strictEqual(obj.name, one);
  });

  test("just position", function () {
    var one = "Bruce",
        ret = ia.fetch(one);
    assert.strictEqual(ret.last, 2);
  });

  test("chained", function () {
    var one = "Bruce",
        obj = ia.fetch(one).get();
    assert.strictEqual(obj.name, one);
  });

  test("non existent value", function () {
    var one = "Herman",
        obj = ia.get(one);
    assert.isNull(obj);
  });

  test("lower nearest non-match within range", function () {
    var one = "Herman",
        obj = ia.get(one, true);
    assert.strictEqual(obj.name, "Gorka");
  });

  test("lower nearest non-match within range not from cache", function () {
    var one = "Fer",
        obj = ia.get(one, true);
    assert.strictEqual(obj.name, "Bruce");
  });

  test("non existent again", function () {
    var one = "Herman",
        obj = ia.get(one);
    assert.isNull(obj);
  });

  test("lower nearest within range again", function () {
    var one = "Herman",
        obj = ia.get(one, true);
    assert.strictEqual(obj.name, "Gorka");
  });

  test("out of range lower", function () {
    var one = "Aaron",
        obj = ia.get(one);
    assert.isNull(obj);
  });

  test("lower nearest oor-", function () {
    var one = "Aaron",
        obj = ia.get(one, true);
    assert.isNull(obj);
  });

  test("out of range higher", function () {
    var one = "Zak",
        obj = ia.get(one);
    assert.isNull(obj);
  });

  test("lower nearest oor+", function () {
    var one = "Zak",
        obj = ia.get(one, true);
    assert.strictEqual(obj.name, "Lars");
  });

});

suite("Get with numeric indexes", function () {

  // test data
  var data = [
    { num: 1 },
    { num: 2 },
    { num: 5 }
  ];
  var ia = new IndexedArray(data, "num");

  test("one value", function () {
    var val = 2,
        obj = ia.get(val);
    assert.strictEqual(obj.num, val);
  });

});

// test: slice including values wr, oor--, oor-wr, wroor+, oor++
suite("Get range", function () {

  // test data
  var data = [
    { name: "Ale" },
    { name: "Alf" },
    { name: "Bruce" },
    { name: "Fran" },
    { name: "Gabi" },
    { name: "Gorka" },
    { name: "Juli" },
    { name: "Lars" }
  ];
  var ia = new IndexedArray(data, "name");

  test("with indexes below, below", function () {
    var obj = ia.getRange("Aadvark", "Aaron");
    assert.isNull(obj);
  });

  test("with indexes below, ok", function () {
    var obj = ia.getRange("Aadvark", "Bruce");
    assert.isNull(obj);
  });

  test("with indexes below, not", function () {
    var obj = ia.getRange("Aadvark", "Herman");
    assert.isNull(obj);
  });

  test("with indexes below, above", function () {
    var obj = ia.getRange("Aadvark", "Zak");
    assert.isNull(obj);
  });

  test("with indexes ok, ok", function () {
    var obj = ia.getRange("Bruce", "Gorka");
    assert.strictEqual(obj.length, 4);
  });

  test("with indexes ok, not", function () {
    var obj = ia.getRange("Bruce", "Herman");
    assert.isNull(obj);
  });

  test("with indexes ok, above", function () {
    var obj = ia.getRange("Bruce", "Zak");
    assert.isNull(obj);
  });

  test("with indexes not, ok", function () {
    var obj = ia.getRange("Herman", "Lars");
    assert.isNull(obj);
  });

  test("with indexes not, not", function () {
    var obj = ia.getRange("Herman", "John");
    assert.isNull(obj);
  });

  test("with indexes not, above", function () {
    var obj = ia.getRange("Herman", "Zak");
    assert.isNull(obj);
  });

  test("with indexes above, above", function () {
    var obj = ia.getRange("Yesi", "Zak");
    assert.isNull(obj);
  });

  test("with inverted indexes", function () {
    var obj = ia.getRange("Gorka", "Bruce");
    assert.isNull(obj);
  });

});

// test: slice including lower nearest wr, oor--, oor-wr, wroor+, oor++
suite("Get aproximated range", function () {

  // test data
  var data = [
    { name: "Ale" },
    { name: "Alf" },
    { name: "Bruce" },
    { name: "Fran" },
    { name: "Gabi" },
    { name: "Gorka" },
    { name: "Juli" },
    { name: "Lars" }
  ];
  var ia = new IndexedArray(data, "name");

  test("with indexes below, below", function () {
    var obj = ia.getRange("Aadvark", "Aaron", true);
    assert.isNull(obj);
  });

  test("with indexes below, ok", function () {
    var obj = ia.getRange("Aadvark", "Bruce", true);
    assert.strictEqual(obj.length, 3);
  });

  test("with indexes below, not", function () {
    var obj = ia.getRange("Aadvark", "Herman", true);
    assert.strictEqual(obj.length, 6);
  });

  test("with indexes below, above", function () {
    var obj = ia.getRange("Aadvark", "Zak", true);
    assert.strictEqual(obj.length, 8);
  });

  test("with indexes ok, ok", function () {
    var obj = ia.getRange("Bruce", "Gorka", true);
    assert.strictEqual(obj.length, 4);
  });

  test("with indexes ok, not", function () {
    var obj = ia.getRange("Bruce", "Herman", true);
    assert.strictEqual(obj.length, 4);
  });

  test("with indexes ok, above", function () {
    var obj = ia.getRange("Bruce", "Zak", true);
    assert.strictEqual(obj.length, 6);
  });

  test("with indexes not, ok", function () {
    var obj = ia.getRange("Herman", "Juli", true);
    assert.strictEqual(obj.length, 2);
  });

  test("with indexes not, not", function () {
    var obj = ia.getRange("Herman", "John", true);
    assert.strictEqual(obj.length, 1);
  });

  test("with indexes not, above", function () {
    var obj = ia.getRange("Herman", "Zak", true);
    assert.strictEqual(obj.length, 3);
  });

  test("with indexes above, above", function () {
    var obj = ia.getRange("Yesi", "Zak", true);
    assert.strictEqual(obj.length, 1);
  });

  test("with inverted indexes", function () {
    var obj = ia.getRange("Gorka", "Bruce", true);
    assert.isNull(obj);
  });

});

// TODO:
//   test custom compare function
//   test custom search function
