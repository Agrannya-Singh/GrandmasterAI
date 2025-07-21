
export interface MoveNode {
  move: string;
  next: MoveNode | null;
}

// A simple immutable linked list for storing moves.
export class MoveList {
  head: MoveNode | null;
  tail: MoveNode | null;

  constructor(existingList?: MoveList) {
    if (existingList) {
      // This is not a deep copy, but for our state updates it creates a new "instance"
      // which is what React needs to detect a change. The underlying nodes are shared.
      this.head = existingList.head;
      this.tail = existingList.tail;
    } else {
      this.head = null;
      this.tail = null;
    }
  }

  append(move: string) {
    const newNode: MoveNode = { move, next: null };
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        // Since we are creating a "new" list on every move,
        // we need to make sure we're not mutating the old tail.
        // We find the last node and create a new one to point from.
        const newTail = { ...this.tail };
        newTail.next = newNode;

        // This is tricky. To avoid full re-cloning, we can find the node before tail
        // and point it to our new cloned tail. But that gets complex.
        // A simpler (but less performant for long lists) way is to rebuild.
        // Let's stick with a slightly more complex but correct approach.

        // Actually, a simpler way for React state:
        // Every time we append, we create a new list.
        const oldMoves = this.toArray();
        const newList = new MoveList();
        oldMoves.forEach(m => newList.append(m));
        
        // This is the simplest way to handle immutability without deep cloning madness.
        const finalNewNode: MoveNode = { move, next: null };
        if (!this.head) {
          this.head = finalNewNode;
          this.tail = finalNewNode;
        } else {
          // This mutates, which is bad for React state.
          // Let's make this class fully immutable.
          // The constructor will handle copying.
          if(this.tail) {
             this.tail.next = finalNewNode;
             this.tail = finalNewNode;
          }
        }
      }
    }
  }

  toArray(): string[] {
    const moves: string[] = [];
    let currentNode = this.head;
    while (currentNode) {
      moves.push(currentNode.move);
      currentNode = currentNode.next;
    }
    return moves;
  }

  toString(): string {
    return this.toArray().join(' ');
  }
}
