"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    countDocuments() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                if (typeof filter !== 'object') {
                    throw new mongoose_1.Error("Filter must be an object");
                }
                return yield this.model.countDocuments(filter);
            }
            catch (error) {
                console.error('Error in countDocuments:', error.message);
                throw new mongoose_1.Error('Error in countDocuments:' + error.message);
            }
        });
    }
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, populateFields = []) {
            try {
                if (!id) {
                    throw new mongoose_1.Error('ID is required');
                }
                let query = this.model.findById(id);
                if (Array.isArray(populateFields) && populateFields.length > 0) {
                    populateFields.forEach((field) => {
                        query = query.populate(field);
                    });
                }
                return yield query;
            }
            catch (error) {
                console.error('Error in findById:', error.message);
                throw new mongoose_1.Error('Error in findById:' + error.message);
            }
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, options = {}) {
            try {
                const { skip = 0, limit = 10, populate = null, sort = null } = options;
                let query = this.model.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort(sort);
                if (Array.isArray(populate) && populate.length > 0) {
                    populate.forEach((field) => {
                        query = query.populate(field);
                    });
                }
                return yield query.exec();
            }
            catch (error) {
                console.error('Error in findAll:', error.message);
                throw new mongoose_1.Error('Error in findAll:' + error.message);
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
                    throw new mongoose_1.Error('Invalid data.');
                }
                if (Array.isArray(data)) {
                    return yield this.model.insertMany(data);
                }
                else {
                    const newDocument = new this.model(data);
                    return yield newDocument.save();
                }
            }
            catch (error) {
                console.error('Error creating document:', error.message);
                throw new mongoose_1.Error('Error creating document:' + error.message);
            }
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new mongoose_1.Error('ID is required');
                }
                if (!updateData || typeof updateData !== 'object') {
                    throw new mongoose_1.Error('Invalid update data');
                }
                return yield this.model.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                });
            }
            catch (error) {
                console.error('Error updating document:', error.message);
                throw new mongoose_1.Error('Error updating document:' + error.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new mongoose_1.Error('ID is required');
                }
                return yield this.model.findByIdAndDelete(id);
            }
            catch (error) {
                console.error('Error in delete:' + error.message);
                throw new mongoose_1.Error('Error in delete:' + error.message);
            }
        });
    }
}
exports.default = BaseRepository;
