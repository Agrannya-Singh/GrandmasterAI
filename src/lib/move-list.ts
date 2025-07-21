
export interface MoveNode {
  move: string;
  next: MoveNode | null;
}

// An immutable linked list for storing moves.
export class MoveList {
  readonly head: MoveNode | null;

  constructor(head: MoveNode | null = null) {
    this.head = head;
  }

  // Returns a new MoveList with the move appended.
  append(move: string): MoveList {
    const newNode: MoveNode = { move, next: null };
    if (!this.head) {
      return new MoveList(newNode);
    }

    const newHead = this.deepClone(this.head);
    let current = newHead;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
    return new MoveList(newHead);
  }

  // Helper to create a deep copy of the nodes to ensure immutability
  private deepClone(node: MoveNode | null): MoveNode | null {
    if (!node) {
      return null;
    }
    const newNode: MoveNode = { move: node.move, next: this.deepClone(node.next) };
    return newNode;
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
