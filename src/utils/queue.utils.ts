import {
  existsSync,
  writeFileSync,
  readFileSync
} from 'fs';

class Queue<T> {
  private _store: T[] = [];
  private _filePath: string = "";

  constructor(filePath: string) {
    this._filePath = filePath;
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, "utf8");
      this._store = JSON.parse(data);
    }
  }

  enqueue(value: T): void {
    if (this._store.includes(value) === false) {
      this._store.push(value);
      this._saveToFile();
    }
  }

  dequeue(): T | undefined {
    const result = this._store.shift();
    this._saveToFile();
    return result;
  }

  size(): number {
    return this._store.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  clean(): void {
    this._store = [];
    this._saveToFile();
  }

  private _saveToFile() {
    writeFileSync(this._filePath, JSON.stringify(this._store), { flag: 'w', encoding: 'utf8' });
  }
}

export default Queue;