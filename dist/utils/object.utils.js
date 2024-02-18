"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFields = void 0;
function removeFields(obj, fieldsToRemove) {
    const newObj = Object.assign({}, obj); // Create a shallow copy of the original object
    fieldsToRemove.forEach((field) => {
        delete newObj[field];
    });
    return newObj;
}
exports.removeFields = removeFields;
