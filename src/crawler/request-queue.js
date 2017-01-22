const internal = Symbol('internal');
const urls = Symbol('urls');

export default class RequestQueue {

    /**
     * Creates an instance of RequestQueue.
     * 
     * 
     * @memberOf RequestQueue
     */
    constructor() {
        /**
         * An internal array for our queue items
         */
        this[internal] = [];
        /**
         * A set containing all the urls currently in the queue
         * Used to speed up access time in our contains method
         */
        this[urls] = new Set();
    }

    /**
     * Adds an item to the back of the queue.
     * 
     * @param {any} requestItem
     * 
     * @memberOf RequestQueue
     */
    enqueue(requestItem) {
        if (this.canAdd(requestItem)) {
            this[urls].add(requestItem.url);
            this[internal].push(requestItem);
        }
    }

    /**
     * Removes an item from the front of the queue
     * 
     * @returns
     * 
     * @memberOf RequestQueue
     */
    dequeue() {
        const requestItem = this[internal].shift();
        this[urls].delete(requestItem.url);
        return requestItem;
    }

    /**
     * Returns the item at the front of the queue without removing it
     * 
     * @returns The item at the front of the queue
     * 
     * @memberOf RequestQueue
     */
    peek() {
        return this[internal][0];
    }

    /**
     * Checks whether the queue contains a requestItem with the same url.
     * 
     * @param {any} requestItem
     * @returns {boolean} True if the queue contains the requestItem, otherwise false
     * 
     * @memberOf RequestQueue
     */
    contains(requestItem) {
        if (!requestItem) {
            return false;
        }
        return this[urls].has(requestItem.url);
    }

    /**
     * We can only add to the queue if the requestItem isnt null and the item is currently in the queue
     * 
     * @param {any} requestItem
     * @returns {boolean} True if we can add, otherwise false
     * 
     * @memberOf RequestQueue
     */
    canAdd(requestItem) {
        return requestItem && !this.contains(requestItem);
    }

    /**
     * Clears all items from the queue
     * 
     * 
     * @memberOf RequestQueue
     */
    clear() {
        this[internal] = [];
        this[urls] = new Set();
    }

    /**
     * Gets the current size of the queue
     * 
     * @readonly
     * 
     * @memberOf RequestQueue
     */
    get size() {
        return this[internal].length;
    }

}