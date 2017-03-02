const promiseIndex = new WeakMap<any, Promise<any>>();

/**
 * A decorator to make asynchronous methods synchronous. The method will be invoked only after all other synchronized methods are finished.
 */
export function synchronize() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            return synchronizeCall.call(this, this, original, ...args);
        };
    };
}

/**
 * Synchronized call to a method. The method is called after all other synchronized calls in the same context are finished.
 * 
 * @param context The context in wich the methods are synchronized
 * @param fn the (asynchronous) method to synchronize
 * @param args arguments to when calling the method
 */
export function synchronizeCall<TResult>(context: any, fn: (...args: any[]) => Promise<TResult> | TResult, ...args: any[]): Promise<TResult> {
    const promise = join(context).then(() => fn.call(this, ...args));
    promiseIndex.set(context, promise);
    return promise;
}

/**
 * Wait for a context to finish it's synchronized function calls and return the last result.
 * 
 * @param context The synchronization context
 */
export function join(context: any): Promise<void> {
    return Promise.resolve(promiseIndex.get(context));
}
