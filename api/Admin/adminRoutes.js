import express from "express"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"
import adminValidation from "./adminValidation.js"
import adminController from "./adminController.js"

const router = express.Router()

/** @see /admin */

// TENANT
/** @REGISTER_TENANT */
router.post(
    "/tenant/register",
    requireAuth(roleConfig.admin),
    adminValidation.registerTenant,
    checkValidation,
    adminController.registerTenant
)

/** @GET_ALL_TENANT */
router.get(
    "/tenant",
    requireAuth(roleConfig.admin),
    adminController.allTenant
)

/** @GET_DETAIL_TENANT */
router.get(
    "/tenant/:_id",
    requireAuth(roleConfig.admin),
    adminController.detailTenant
)

/** @EDIT_TENANT */
router.put(
    "/tenant/:_id",
    requireAuth(roleConfig.admin),
    adminValidation.uploadValidationProfileImage,
    adminValidation.editTenant,
    checkValidation,
    adminController.editTenant
)
// END OF TENANT

// CUSTOMER
/** @GET_ALL_CUSTOMER */
router.get(
    "/customer",
    requireAuth(roleConfig.admin),
    adminController.allCustomer
)

/** @GET_DETAIL_CUSTOMER */
router.get(
    "/customer/:_id",
    requireAuth(roleConfig.admin),
    adminController.detailCustomer
)
// END OF CUSTOMER

export default router