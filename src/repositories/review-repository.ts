

import Review from "../models/Review";
import BaseRepository from "./base-repository";
import {Error} from "mongoose";

class ReviewRepository extends BaseRepository {
    constructor() {
        super(Review);
    }

    async deleteAllByUsername(username: string) {
        try{
            if (!username) {
                throw new Error('Username is required');
            }

            return await this.model.deleteMany({username: username});
        } catch (error: any) {
            console.error('Error in delete:' + error.message);
            throw new Error('Error in delete:' + error.message);
        }
    }
}

export default ReviewRepository;