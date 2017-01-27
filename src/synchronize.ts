const promiseIndex = new WeakMap<any, Promise<any>>();

export function synchronize(context?: any) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (typeof descriptor.value !== "function") throw new Error("please user @synchronize on a function!");

        const key = context || target;
        const original = descriptor.value;

        descriptor.value = function (...args) {
            const lastPromise = Promise.resolve(promiseIndex.get(key));
            const promise = lastPromise.then(() => original.apply(this, args));
            promiseIndex.set(key, promise);
            return promise;
        };
    };
}
