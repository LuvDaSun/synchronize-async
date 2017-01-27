const promiseIndex = new WeakMap<any, Promise<any>>();

export function synchronize() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (typeof descriptor.value !== "function") throw new Error("please use @synchronize on a function!");

        const original = descriptor.value;

        descriptor.value = function (...args) {
            const lastPromise = Promise.resolve(promiseIndex.get(target));
            const promise = lastPromise.then(() => original.apply(this, args));
            promiseIndex.set(target, promise);
            return promise;
        };
    };
}
