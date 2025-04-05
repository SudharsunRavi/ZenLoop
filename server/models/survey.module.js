const mongoose=require('mongoose')

const surveySchema=new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        responses: [
            {
              question: { type: String, required: true },
              answer: { type: mongoose.Schema.Types.Mixed, required: true },
            },
        ],
        summary: {
            type: [String]
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Survey', surveySchema)