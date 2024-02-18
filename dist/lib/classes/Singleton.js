"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Singleton {
    //private static instance: Singleton | null = null;
    constructor() { }
    static getInstance(...args) {
        if (!this.instance) {
            this.instance = new this(...args);
        }
        return this.instance;
    }
}
exports.default = Singleton;
