import mongoose from 'mongoose';

const reviewScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    object: {
        type: Object,
        required: true,
    }
});

const Review = mongoose.model('Review', reviewScheme);
export default Review;