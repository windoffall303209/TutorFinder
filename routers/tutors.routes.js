const express = require("express");
const router = express.Router();
const tutorsController = require("../controllers/tutors.controller");

router.get("/", tutorsController.index);
router.get("/create", tutorsController.create); // Thêm route cho trang tạo mới
router.post("/", tutorsController.store); // Thêm route để xử lý form
router.get("/:id", tutorsController.show);

module.exports = router;
