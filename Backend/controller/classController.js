import Class from "../models/Class.js"

export const createClass = async (req, res) => {
    try {
        const {name,  academicYear, notes } = req.body;
        const newClass = await Class.create({
            name,
            academicYear,
            notes,
            accountId: req.tenantAccountId,
        });
        res.status(201).json({ success: true, class: newClass })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


export const getClass = async (req, res) => {
    try {
        const { academicYear } = req.query;
    //     if (!academicYear) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "academicYear is required",
    //   });
    // }
        const query ={}
        if(academicYear){
            query.academicYear = academicYear;
        }
        if(req.user.role !== "SuperAdmin"){
            query.accountId =req.tenantAccountId
        }
        const classes = await Class.find(query);
        res.status(200).json({ success: true, classes });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}