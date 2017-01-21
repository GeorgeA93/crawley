const internal = Symbol('internal');

export default class RequestQueue {

    constructor() {
        this[internal] = [];
    }

    enqueue(requestItem) {
        if (this.canAdd(requestItem)) {
            this[internal].push(requestItem);
        }
    }

    dequeue() {
        return this[internal].shift();
    }

    peek() {
        return this[internal][0];
    }

    contains(requestItem) {
        if (!requestItem) {
            return false;
        }
        for (let i = 0; i < this.size; i++) {
            if (requestItem.url === this[internal][i].url) {
                return true;
            }
        }
        return false;
    }

    canAdd(requestItem) {
        return requestItem;
    }

    clear() {
        this[internal] = [];
    }

    get size() {
        return this[internal].length;
    }

}