const internal = Symbol('internal');
const urls = Symbol('urls');

export default class RequestQueue {

    constructor() {
        this[internal] = [];
        this[urls] = new Set();
    }

    enqueue(requestItem) {
        if (this.canAdd(requestItem)) {
            this[urls].add(requestItem.url);
            this[internal].push(requestItem);
        }
    }

    dequeue() {
        const requestItem = this[internal].shift();
        this[urls].delete(requestItem.url);
        return requestItem;
    }

    peek() {
        return this[internal][0];
    }

    contains(requestItem) {
        if (!requestItem) {
            return false;
        }
        return this[urls].has(requestItem.url);
    }

    canAdd(requestItem) {
        return requestItem && !this.contains(requestItem);
    }

    clear() {
        this[internal] = [];
    }

    get size() {
        return this[internal].length;
    }

}