const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

// Public routes
router.post("/signup", controller.signup);
router.post("/login", controller.login);

// Any authenticated user: operate only on their own account/profile
router.get("/me", auth, controller.getMe);
router.put("/me", auth, controller.updateMe);
router.post("/me/profile", auth, controller.addMyProfile);
router.put("/me/profile", auth, controller.updateMyProfile);

// Faculty-only routes
router.get("/students", auth, authorizeRole("FACULTY"), controller.getAllStudents);
router.get("/faculty", auth, authorizeRole("FACULTY"), controller.getAllFaculty);
router.put("/students/:id", auth, authorizeRole("FACULTY"), controller.updateStudent);
router.put("/students/:id/profile", auth, authorizeRole("FACULTY"), controller.updateStudentProfile);
router.delete("/students/:id", auth, authorizeRole("FACULTY"), controller.softDeleteStudent);

module.exports = router;
