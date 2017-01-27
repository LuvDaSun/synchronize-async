import * as test from "tape";
import { synchronize } from "./synchronize";


class Queue {

    numbers = ["0", "1", "2", "3"];

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
        return this.numbers[3];
    }
}



test("synchronize", async t => {
    const l = [];

    const q = new Queue();
    q.one().then(v => l.push(v));
    t.deepEqual(l, []);

    q.two().then(v => l.push(v));
    t.deepEqual(l, []);

    await q.three().then(v => l.push(v));
    t.deepEqual(l, ["1", "2", "3"]);

    t.end();
});


