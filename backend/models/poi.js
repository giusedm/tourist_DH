// backend/models/poi.js

import mongoose from 'mongoose';

const poiSchema = new mongoose.Schema({
    name: String,
    type: String,
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }, // [lon, lat]
    }
});

poiSchema.index({ location: '2dsphere' });

export default mongoose.model('POI', poiSchema);

