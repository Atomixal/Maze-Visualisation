// Writing my own stack class because I don't know why there isn't one built in :(
export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Cannot pop from empty stack");
    }
    return this.items.pop()!;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Cannot peek at empty stack");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  safePop(): T | undefined {
    return this.items.pop();
  }

  safePeek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.items.length - 1];
  }

  toArray(): T[] {
    return [...this.items]; // Return a copy to prevent external modification
  }
}
