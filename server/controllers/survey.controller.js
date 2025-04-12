const surveyModule = require("../models/survey.module");
const userModule = require("../models/user.module");

const addSurvey=async(req, res)=>{
    try {
        const { responses, summary } = req.body;
        const userId = req.user

        const isUser=await userModule.findById(userId)
        if(!isUser) throw new Error("User doesnot exist.")

        const newSurvey = new surveyModule({ userId, responses, summary });
        await newSurvey.save();
        res.status(201).json({ status: true, message: "Added successfully", survey: newSurvey });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

const getSurvey=async(req,res)=>{
    try {
        const {userid}=req.params;
        const isUser=await userModule.findById(userid)
        if(!isUser) throw new Error("User doesnot exist.")

        const sureryData=await surveyModule.findOne({userId: userid})
        res.status(201).json({ status: true, data: sureryData });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

const updateSurvey=async(req,res)=>{
    try {
        const { responses, summary } = req.body;
        const userId = req.user;

        const updatedSurvey = await surveyModule.findOneAndUpdate(
            { userId },
            { responses, summary },
            { new: true, runValidators: true }
        );

        if (!updatedSurvey) return res.status(404).json({ message: "Survey not found for this user" });
        res.status(200).json({ status:true, message: "Updated successfully", survey: updatedSurvey });
    } catch (error) {
        res.status(500).json({ status:false, error: error.message });
    }
}

module.exports={addSurvey, getSurvey, updateSurvey}