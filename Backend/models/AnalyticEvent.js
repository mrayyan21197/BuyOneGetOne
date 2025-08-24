import mongoose from 'mongoose';
const { Schema } = mongoose;

const AnalyticEventSchema = new Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['view', 'click', 'conversion', 'signup', 'login', 'search']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  promotion: {
    type: Schema.Types.ObjectId,
    ref: 'Promotion'
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  searchQuery: {
    type: String
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'other']
  },
  browser: String,
  os: String,
  ip: String,
  referer: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for time-based queries
AnalyticEventSchema.index({ timestamp: -1 });

export default mongoose.model('AnalyticEvent', AnalyticEventSchema);