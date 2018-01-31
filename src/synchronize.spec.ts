// tslint:disable:max-classes-per-file

import * as test from "tape";
import { join, synchronize } from "./synchronize";

class Count {

    public numbers = ["zero", "one", "two", "three"];

    @synchronize()
    public async one() {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return "1";
    }

    @synchronize()
    public async two() {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return "2";
    }

    @synchronize()
    public async three() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "3";
    }

    @synchronize()
    public async num(n: number) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return this.numbers[n];
    }
}

class SillyCalculatorExample {
    public current = 0;

    @synchronize()
    public async add(value: number) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.current += value;
        return this.current;
    }

}

test("synchronize", async (t) => {
    const l = new Array<string>();

    const c = new Count();
    c.one().then((v) => l.push(v));
    t.deepEqual(l, []);

    c.two().then((v) => l.push(v));
    t.deepEqual(l, []);

    await c.three().then((v) => l.push(v));
    t.deepEqual(l, ["1", "2", "3"]);

    c.num(0).then((v) => l.push(v));
    await c.num(1).then((v) => l.push(v));

    c.num(2).then((v) => l.push(v));
    c.num(3).then((v) => l.push(v));

    await join(c);
    t.deepEqual(l, ["1", "2", "3", "zero", "one", "two", "three"]);

    t.end();
});

test("silly calculator", async (t) => {
    const calculator = new SillyCalculatorExample();
    calculator.add(5).then((value) => {
        // value === 5
        t.equal(value, 5);
    });
    calculator.add(5).then((value) => {
        // value === 10 (!)
        t.equal(value, 10);
    });

    // also, you can get the result of the last promise with the join function
    join(calculator).then((value) => {
        t.equal(value, 10);
    });

    await join(calculator);
    t.end();
});
