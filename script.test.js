const assert = require('assert');

function greet() {
    return "Hello World!";
}

assert.strictEqual(greet(), "Hello World!");

console.log("All tests passed!");
