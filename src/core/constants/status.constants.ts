export const COMPLAINT_STATUS = {
  REJECTED: -1,
  ARCHIVED: -1, // No user request specifically for separate -2
  PENDING: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
} as const;

export const COMPLAINT_STATUS_LABELS: Record<number, string> = {
  [COMPLAINT_STATUS.PENDING]: "Pendente",
  [COMPLAINT_STATUS.IN_PROGRESS]: "Em Progresso",
  [COMPLAINT_STATUS.RESOLVED]: "Resolvido",
  [COMPLAINT_STATUS.REJECTED]: "Rejeitado/Arquivado",
};

export const PETITION_STATUS = {
  CANCELLED: -1,
  ARCHIVED: -1,
  COLLECTING: 0,
  GOAL_REACHED: 1,
  FILED: 2,
  FINISHED: 3,
} as const;

export const PETITION_STATUS_LABELS: Record<number, string> = {
  [PETITION_STATUS.COLLECTING]: "Em Coleta",
  [PETITION_STATUS.GOAL_REACHED]: "Meta Atingida",
  [PETITION_STATUS.FILED]: "Protocolado",
  [PETITION_STATUS.FINISHED]: "Finalizado",
  [PETITION_STATUS.CANCELLED]: "Cancelado/Arquivado",
};
