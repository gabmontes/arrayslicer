# Array Slicer

Node.JS module that implements an optimized binary search over a given array of objects.

## Quick example

```javascript
var IndexedArray = require("arrayslicer");

var ia = new IndexedArray([{num: 1}, {num: 2}, {num: 5}], "num");

ia.fetch(2); // ia.last is set to 1
ia.get(1); // -> {num: 1}
ia.getRange(2, 5); // -> [{num: 2}, {num: 5}]
```

## Install

```bash
npm install arrayslicer
```

## API

### IndexedArray(array, index)

Creates a new `IndexedArray` object based on `array` and indexed by the property `index`.

### IndexedArray.sort()

Sort the `IndexedArray` by its index property. This is needed to ensure the values are retrieved properly.

### IndexedArray.fetch(value, orprev)

Sets the internal pointer of the `IndexedArray` to the element with index equal `value`.

If `orprev` is `true` and there are no elements matching `value`, the element with the lower nearest index to `value` is fetch.

### IndexedArray.get(value, orprev)

Gets the element with index equal `value`.

If `orprev` is `true` and there are no elements matching `value`, the element with the lower nearest index to `value` is retrieved.

### IndexedArray.get(begin, end, aprox)

Returns an array containing all the elements with indexes between `begin` and `end`.

If `aprox` is `true`, the boundaries not found will default to the lower entry. If the begin boundary falls out of range, it defaults to the beginning.

### IndexedArray.setCompare(fn)

Use a custom compare function.

### IndexedArray.setSort(fn)

Use a custom sort function.

## Licence

WTFPL
