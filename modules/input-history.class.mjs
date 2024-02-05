/*
  InputHistory keeps history items of arbitrary type as a bidirectional lists (undoable items, redoable items).
  Undo returns latest undoable item and marks it as redoable.
  Redo returns first redoable item
  Add inserts an item as the latest undoable and clears redoable items.
  History capacity is limited.

  Use cases:
  As a user I changed the data and I want to be able to revert to previous version.
  App: add previous version as undoable to the history and clear redoables.

  As a user I changed data but want to revert to previous version, yet being able to redo the changes.
  App: return first redoable and mark it as undoable

 */

export class InputHistory {
  constructor(size = 10) {
    this.sizeMax = size;
    this.itemsCount = 0;
    this.newest = this.firstUndoable = this.last = null;
  }

  add(content) {
    const newItem = new HistoryItem(this.firstUndoable, content);
    if (!this.firstUndoable) { this.newest = this.latest = newItem; }
    this.firstUndoable = newItem;
    this.itemsCount++;
    if (this.itemsCount > this.sizeMax) {
      // remove newest redoable to fit the size
      if (this.newest !== this.firstUndoable) { // if we have any redoables
        this.newest.next.prev = null;
        this.newest = this.newest.next;
      }
    }
    if (this.itemsCount > this.sizeMax) {
      // remove latest undoable to fit the size
      this.latest.prev.next = null;
      this.latest = this.latest.prev;
    }
  }

  undo() {

  }

  redo() {

  }
}

class HistoryItem {
  constructor(insertBefore, content) {
    this.content = content;
    this.prev = this.next = null;
    this.insertBefore(insertBefore);
    this.redoable = false;
  }

  /**
   * Inserts item before given item.
   * If given item is undoable (!redoable) and previous item
   * If previous item is redoable then entire head of redoable items is trimmed.
   * as redoing doesn't make any sense anymore.
   * @param item {HistoryItem}
   * @returns {HistoryItem}
   */
  insertBefore = item => {
    if (!item) return this;
    this.next = item;
    this.prev = null;
    item.prev = this;
  }

  get redoable() { return this._redoable; }
  set redoable(isRedoable) { this._redoable = isRedoable; }

  get content() { return this._content; }
  set content(content) { this._content = content; }

}
