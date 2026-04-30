import Subject from "../models/Subject.js";

export const createSubject = async(req, res)=>{
    try {
        const {name,code, description}  = req.body;

        if(!name){
            return res.status(400).json({message: "Subject name is required"})
        }
        const subject = await Subject.create({name, code, description, accountId: req.tenantAccountId});

        res.status(201).json({message: "Subject Added SucessFully", subject})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getAllSubjects = async(req, res)=>{
    try {
        const query = req.user.role === "SuperAdmin" ? {} : {accountId: req.tenantAccountId};
        const subjects = await Subject.find(query);
        res.status(200).json({message: "Subject Fetched Sucessfully", subjects})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}