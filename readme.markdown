# synchronize-async [![Build Status](https://travis-ci.org/LuvDaSun/synchronize-async.svg?branch=master)](https://travis-ci.org/LuvDaSun/synchronize-async)

Sometimes, you want you methods to act synchronous. This library helps.

Simple add the `synchronize` decorator to methods that should be synchronized, like this:

```javascript
import {synchronize} from "synchronize-async";

class SillyCalculatorExample {
    current = 0;

    @synchronize()
    async add(value) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.current += value;
        return this.current;
    }

}
```

Now this code will yield in the proper result!

```javascript
import * as assert from "assert";
import {synchronize, join} from "synchronize-async";

const calculator = new SillyCalculatorExample();
calculator.add(5).then(value => {
    // value === 5
    assert.equal(value, 5);
});
calculator.add(5).then(value => {
    // value === 10 (!)
    assert.equal(value, 10);
});

// also, you can get the result of the last promise with the join function
join(calculator).then(value => {
    assert.equal(value, 10);
});

```