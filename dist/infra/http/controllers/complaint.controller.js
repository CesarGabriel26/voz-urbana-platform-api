"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintController = void 0;
const prisma_complaint_repository_1 = require("../../database/repositories/prisma-complaint.repository");
const CreateComplaintUseCase_1 = require("../../../core/usecases/complaint/CreateComplaintUseCase");
const ListComplaintsUseCase_1 = require("../../../core/usecases/complaint/ListComplaintsUseCase");
const GetComplaintByIdUseCase_1 = require("../../../core/usecases/complaint/GetComplaintByIdUseCase");
const UpdateComplaintUseCase_1 = require("../../../core/usecases/complaint/UpdateComplaintUseCase");
const DeleteComplaintUseCase_1 = require("../../../core/usecases/complaint/DeleteComplaintUseCase");
const VoteComplaintUseCase_1 = require("../../../core/usecases/complaint/VoteComplaintUseCase");
const repo = new prisma_complaint_repository_1.PrismaComplaintRepository();
const createUseCase = new CreateComplaintUseCase_1.CreateComplaintUseCase(repo);
const listUseCase = new ListComplaintsUseCase_1.ListComplaintsUseCase(repo);
const getByIdUseCase = new GetComplaintByIdUseCase_1.GetComplaintByIdUseCase(repo);
const updateUseCase = new UpdateComplaintUseCase_1.UpdateComplaintUseCase(repo);
const deleteUseCase = new DeleteComplaintUseCase_1.DeleteComplaintUseCase(repo);
const voteUseCase = new VoteComplaintUseCase_1.VoteComplaintUseCase(repo);
class ComplaintController {
    async create(req, res) {
        try {
            const userId = req.user.sub;
            const result = await createUseCase.execute({ ...req.body, createdBy: userId });
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async list(req, res) {
        try {
            const result = await listUseCase.execute(req.query);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const result = await getByIdUseCase.execute(req.params.id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const userId = req.user.sub;
            const result = await updateUseCase.execute(req.params.id, userId, req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.user.sub;
            await deleteUseCase.execute(req.params.id, userId);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async vote(req, res) {
        try {
            const userId = req.user.sub;
            await voteUseCase.execute(req.params.id, userId);
            return res.status(201).send();
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.ComplaintController = ComplaintController;
