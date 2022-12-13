// console.log(arguments);
// console.log(require("module").wrapper);

// module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 7));

// exports
const { add, multiply, substrack } = require("./test-module-2");
console.log(add(9, 7));

// Caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
