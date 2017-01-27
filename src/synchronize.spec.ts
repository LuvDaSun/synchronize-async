import * as test from "tape";
import { synchronize, join } from "./synchronize";


class Count {

    numbers = ["zero", "one", "two", "three"];

    @synchronize()
    async one() {
        await new Promise(resolve => setTimeout(resolve, 300));
        return "1";
    }

    @synchronize()
    async two() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return "2";
    }

    @synchronize()
    async three() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return "3";
    }

    @synchronize()
    async num(n: number) {
        await new Promise(resolve => setTimeout(resolve, 400));
        return this.numbers[n];
    }
}



test("synchronize", async t => {
    const l = [];

    const c = new Count();
    c.one().then(v => l.push(v));
    t.deepEqual(l, []);

    c.two().then(v => l.push(v));
    t.deepEqual(l, []);

    await c.three().then(v => l.push(v));
    t.deepEqual(l, ["1", "2", "3"]);

    c.num(0).then(v => l.push(v));
    await c.num(1).then(v => l.push(v));

    c.num(2).then(v => l.push(v));
    c.num(3).then(v => l.push(v));

    await join(c);
    t.deepEqual(l, ["1", "2", "3", "zero", "one", "two", "three"]);

    t.end();
});


