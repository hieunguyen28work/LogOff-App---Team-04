import mongoose from 'mongoose'
import { RequestSTT } from '../constants/enum'
const Schema = mongoose.Schema

const RequestLogOffSchema = new Schema(
  {
    iduser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },

    masters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],

    approval: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],

    logofffrom: {
      type: Date,
    },

    logoffto: {
      type: Date,
    },

    reason: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(RequestSTT),
    },
  },
  {
    timestamps: true,
  }
)

export const RequestLogOff = mongoose.model('requestlogoffs', RequestLogOffSchema)
