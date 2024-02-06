interface SingletonConstructor<T> {
  new (...args: any[]): T;
  instance: T | null;
}

export default class Singleton {
  //private static instance: Singleton | null = null;
  constructor() {}

  public static getInstance<T extends Singleton>(
    this: SingletonConstructor<T>,
    ...args: any[]
  ): T {
    if (!this.instance) {
      this.instance = new this(...args);
    }
    return this.instance as T;
  }
}
