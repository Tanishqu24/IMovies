const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true
    },
    poster: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    backdrop: {
      type: String,
      required: [true, 'Backdrop image URL is required']
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true
    },
    language: {
      type: [String],
      required: [true, 'At least one language is required'],
      index: true
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    cast: {
      type: [String],
      default: []
    },
    director: {
      type: String,
      default: 'Unknown'
    },
    certification: {
      type: String,
      enum: ['U', 'UA', 'A', 'R', 'PG-13'],
      default: 'UA'
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming', 'archived'],
      default: 'now_showing',
      index: true
    }
  },
  {
    timestamps: true
  }
);

movieSchema.index(
  { title: 'text', description: 'text', director: 'text' },
  { language_override: 'none' }
);

module.exports = mongoose.model('Movie', movieSchema);
