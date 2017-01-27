const promiseIndex = new WeakMap<any, Promise<any>>();

export function synchronize() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            return synchronizeCall(this, original, this, ...args);
        }
    };
}

export function synchronizeCall(context: any, fn: (...args: any[]) => Promise<any>, target: any, ...args: any[]): Promise<any> {
    const promise = join(context).then(() => fn.apply(target, args));
    promiseIndex.set(context, promise);
    return promise;
}

export function join(context: any): Promise<void> {
    return Promise.resolve(promiseIndex.get(context));
}
