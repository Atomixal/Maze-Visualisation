"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
// Writing my own stack class because I don't know why there isn't one built in :(
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        if (this.isEmpty()) {
            throw new Error("Cannot pop from empty stack");
        }
        return this.items.pop();
    }
    peek() {
        if (this.isEmpty()) {
            throw new Error("Cannot peek at empty stack");
        }
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    clear() {
        this.items = [];
    }
    safePop() {
        return this.items.pop();
    }
    safePeek() {
        return this.isEmpty() ? undefined : this.items[this.items.length - 1];
    }
    toArray() {
        return [...this.items]; // Return a copy to prevent external modification
    }
}
exports.Stack = Stack;
