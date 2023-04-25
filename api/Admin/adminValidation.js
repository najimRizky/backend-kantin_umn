import { body, param } from "express-validator";
import validTenantName from "../../config/validTenantName.js";
import uploadConfig from "../../config/uploadConfig.js";
import multer from "multer";
import responseParser from "../../helper/responseParser.js";

const uploadValidationProfileImage = async (req, res, next) => {
    uploadConfig.single("profile_image")(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw Error("File is too large, maximum 2MB")
            } else if (err) {
                throw Error("File not supported")
            } else {
                next()
            }
        } catch (err) {
            return responseParser({ status: 400, error: err.message }, res)
        }
    })
}

const registerTenant = [
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not included or invalid email"),
    body("full_name")
        .exists({ checkFalsy: true })
        .custom((value) => {
            if (!validTenantName.test(value)) throw new Error("Full name is not included or invalid full name")
            return true
        }),
    body("description")
        .exists()
        .withMessage("Description field is required"),
    body("location")
        .exists()
        .withMessage("Location field is required"),
    body("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be included with at least 6 characters long")
]

const editTenant = [
    param("_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Tenant id is not included or invalid id"),
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not included or invalid email"),
    body("full_name")
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 6 })
        .withMessage("Full name is not included"),
    body("description")
        .exists()
        .withMessage("Description field is required"),
    body("location")
        .exists()
        .withMessage("Location field is required"),
]

const deleteTenant = [
    param("_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Tenant id is not included or invalid id"),
]

export default {
    uploadValidationProfileImage,
    registerTenant,
    editTenant,
    deleteTenant
}