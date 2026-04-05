import { Router } from "express";
import { RecordController } from "./record.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth(), RecordController.createRecord);
router.get("/", auth(), RecordController.getAllRecords);

export default router;