import {Error, Model} from "mongoose";

import {Options} from "../interfaces";

class BaseRepository {
    protected model: Model<any>;

    constructor(model: Model<any>) {
        this.model = model;
    }

    async countDocuments(filter = {}) {
        try{
            if (typeof filter !== 'object') {
                throw new Error("Filter must be an object");
            }

            return await this.model.countDocuments(filter);
        }catch (error: any) {
            console.error('Error in countDocuments:', error.message);
            throw new Error('Error in countDocuments:' + error.message);
        }
    }

    async findById(id: number, populateFields = []) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }

            let query = this.model.findById(id);

            if (Array.isArray(populateFields) && populateFields.length > 0) {
                populateFields.forEach((field) => {
                    query = query.populate(field);
                });
            }

            return await query;
        } catch (error: any) {
            console.error('Error in findById:', error.message);
            throw new Error('Error in findById:' + error.message);
        }
    }

    async findAll(filter: object = {}, options: Options = {}) {
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

            return await query.exec();
        } catch (error: any) {
            console.error('Error in findAll:', error.message);
            throw new Error('Error in findAll:' + error.message);
        }
    }

    async create(data: object) {
        try {
            if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
                throw new Error('Invalid data.');
            }

            if (Array.isArray(data)) {
                return await this.model.insertMany(data);
            } else {
                const newDocument = new this.model(data);
                return await newDocument.save();
            }
        } catch (error: any) {
            console.error('Error creating document:', error.message);
            throw new Error('Error creating document:' + error.message);
        }
    }

    async update(id: number, updateData: object) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            if (!updateData || typeof updateData !== 'object') {
                throw new Error('Invalid update data');
            }
            return await this.model.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
        } catch (error: any) {
            console.error('Error updating document:', error.message);
            throw new Error('Error updating document:' + error.message);
        }
    }

    async delete(id: number) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            return await this.model.findByIdAndDelete(id);
        } catch (error: any) {
            console.error('Error in delete:' + error.message);
            throw new Error('Error in delete:' + error.message);
        }
    }
}

export default BaseRepository;