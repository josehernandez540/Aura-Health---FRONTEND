import type { TreatmentStatus } from "../services/treatment.service";

export const TREATMENT_STATUS_LABEL: Record<TreatmentStatus, string> = {
  ACTIVE: "Activo",
  COMPLETED: "Completado",
  PENDING_APPROVAL: "Pendiente aprobación",
};

export const TREATMENT_STATUS_BADGE_CLASS: Record<TreatmentStatus, string> = {
  ACTIVE: "badge status-active",
  COMPLETED: "badge badge-blue",
  PENDING_APPROVAL: "badge status-pending",
};
