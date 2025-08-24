import mongoose from 'mongoose';
const { Schema } = mongoose;

const PromotionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Promotion title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['food', 'fashion', 'electronics', 'home', 'beauty', 'sports', 'travel', 'entertainment', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  type: {
    type: String,
    required: [true, 'Promotion type is required'],
    enum: {
      values: ['discount', 'bogo', 'gift', 'freeShipping', 'bundle', 'other'],
      message: '{VALUE} is not a valid promotion type'
    }
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  redirectUrl: {
    type: String,
    required: [true, 'Redirect URL is required'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL with HTTP or HTTPS'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  terms: {
    type: String
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    trim: true
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Define index for searching
PromotionSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Update conversion rate when clicks change
PromotionSchema.pre('save', function(next) {
  if (this.impressions > 0) {
    this.conversionRate = (this.clicks / this.impressions) * 100;
  }
  next();
});

// Create virtual for time remaining
PromotionSchema.virtual('timeRemaining').get(function() {
  return this.endDate.getTime() - Date.now();
});

// Add method to increment clicks
PromotionSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  return this.save();
};

// Add method to increment impressions
PromotionSchema.methods.incrementImpressions = async function() {
  this.impressions += 1;
  return this.save();
};

export default mongoose.model('Promotion', PromotionSchema);