const { Op } = require("sequelize");
const { sendError, sendSuccess } = require("../helpers/responseSender");
const userModel = require("../models/user");

const getUser = async (req, res) => {
    const { query: { page = 1, gender, search } } = req;
    const pageSize = 1;
    const offset = (page - 1) * pageSize;

    // Construct where clause
    const whereClause = {};
    if (search) {
        whereClause[Op.or] = [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { mobile_number: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
            { country: { [Op.like]: `%${search}%` } },
        ];
    }
    if (gender) {
        whereClause.gender = gender;
    }
    try {
        // Fetch total count of records
        const totalCount = await userModel.count({ where: whereClause });

        // Fetch records with pagination
        const users = await userModel.findAll({
            where: whereClause,
            attributes: [
                "id",               
                "first_name",
                "last_name",
                "email",
                "mobile_number",
                "address",
                "country",
                "birthdate",
                "image",
                "age",
                "gender"                
            ],
            order: [['age', "DESC"]],
            limit: pageSize,
            offset,
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        // Prepare response data
        return sendSuccess(res, {
            data: users,
            totalPages,
            currentPage: page,
            count: totalCount,
            message: "User list retrieved successfully.",
        });
    } catch (error) {
        return sendError(res, { message: error.message });
    }
};
// Function to calculate age from birthdate
const ageDiff = (date) => {
    const date1 = new Date(date);
    const date2 = new Date();
    let diff = date2.getTime() - date1.getTime();
    let daydiff = (diff / 31536000000).toFixed(0);
    return daydiff;
};
const addUser = async (req, res) => {
    try {
        let { body,file } = req;
        
        if (file) {
            body.image = file.filename;
        }
        body.age = ageDiff(body.birthdate);
       
        let user = await userModel.create(body);
       
        let response = {
            message: "User added successfully.",
            data: user,
        };

        sendSuccess(res, response);
    } catch (error) {
        console.log("🚀 ~ addUser ~ error:", error)
        sendError(res, error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        let { body,file } = req;
        
        const { id } = req.params;
        if (file) {
            body.image = file.filename;
        }
        body.age = ageDiff(body.birthdate);
        console.log("🚀 ~ updateUser ~ body:", body)
        let update_user = await userModel.update(body, { where: { id: id } });
        console.log("🚀 ~ updateUser ~ update_user:", update_user)
      
        let response = {
            message: "User updated successfully.",
            data: update_user,
        };
        
        sendSuccess(res, response);
    } catch (error) {       
        console.log("🚀 ~ updateUser ~ error:", error)
        sendError(res, error.message);
    }
};

const getUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;      
       
        const user = await userModel.findOne({ where: { id } }); 

        if (!user) {
            throw new Error(`User with id ${id} not found.`);
        }

        return sendSuccess(res, {
            data: user,
            message: "User data retrieved for update.",
        });
    } catch (error) {
        return sendError(res, { message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.destroy({ where: { id } });

        if (!deletedUser) {
            throw new Error(`User with id ${id} not found.`);
        }

        return sendSuccess(res, { message: "User deleted successfully.", data: deletedUser });
    } catch (error) {
        return sendError(res, { message: error.message });
    }
};


module.exports = {
    addUser,
    updateUser,
    getUpdateUser,
    getUser,
    deleteUser,    
};
