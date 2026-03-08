"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListComplaintsUseCase = void 0;
class ListComplaintsUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(filters) {
        return this.complaintRepository.findAll(filters);
    }
}
exports.ListComplaintsUseCase = ListComplaintsUseCase;
