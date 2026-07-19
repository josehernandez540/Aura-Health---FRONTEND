export type TourPlacement = "right" | "bottom" | "top" | "center";

export interface TourStep {
  selector: string;
  route?: string;
  title: string;
  description: string;
  placement: TourPlacement;
}

const WELCOME_STEP: TourStep = {
  selector: "",
  title: "¡Bienvenido a Aura Health!",
  description:
    "Te mostramos rápidamente cómo moverte por el sistema. Puedes salir del recorrido cuando quieras con \"Saltar tour\".",
  placement: "center",
};

const SIDEBAR_TOGGLE_STEP: TourStep = {
  selector: '[data-tour="sidebar-toggle"]',
  title: "Menú lateral",
  description: "Colapsa el menú para tener más espacio en pantalla. Tu preferencia se guarda automáticamente.",
  placement: "right",
};

const navStep = (path: string, title: string, description: string): TourStep => ({
  selector: `[data-tour="nav-${path}"]`,
  route: path,
  title,
  description,
  placement: "right",
});

const dashboardStatsStep = (description: string): TourStep => ({
  selector: '[data-tour="dashboard-stats"]',
  route: "/dashboard",
  title: "Estadísticas en vivo",
  description,
  placement: "bottom",
});

const appointmentsFiltersStep: TourStep = {
  selector: '[data-tour="appointments-filters"]',
  route: "/appointments",
  title: "Filtra las citas",
  description: "Filtra por estado (por ejemplo, para ver solo las Programadas), por fecha, o cuántas mostrar por página.",
  placement: "bottom",
};

export const ADMIN_TOUR_STEPS: TourStep[] = [
  WELCOME_STEP,
  SIDEBAR_TOGGLE_STEP,
  navStep("/dashboard", "Panel de Control", "Un resumen general: pacientes, médicos, citas del mes y la actividad reciente del sistema."),
  dashboardStatsStep("Estas tarjetas se actualizan con datos reales del sistema cada vez que entras."),
  navStep("/appointments", "Gestión de Citas", "Programa, reprograma o cancela citas médicas desde la lista o el calendario."),
  appointmentsFiltersStep,
  navStep("/patients", "Pacientes", "Administra el registro de pacientes: datos, nivel de riesgo y expedientes."),
  navStep("/records", "Historial Clínico", "Consulta y sube documentos clínicos de los pacientes."),
  navStep("/treatments", "Tratamientos", "Da seguimiento a los tratamientos activos y sus aprobaciones."),
  navStep("/doctors", "Médicos", "Administra las cuentas y el estado de los médicos del sistema."),
  navStep("/audit", "Auditoría", "Revisa el historial completo de acciones realizadas en el sistema."),
  navStep("/reports", "Reportes", "Genera reportes clínicos en PDF, individuales o consolidados, con filtros e historial."),
  navStep("/analiticas", "Analíticas", "Visualiza estadísticas y tendencias del sistema en gráficas."),
  navStep("/profile", "Mi Perfil", "Edita tu nombre, correo y contraseña desde aquí. ¡Listo! Ya puedes explorar el resto por tu cuenta."),
];

export const DOCTOR_TOUR_STEPS: TourStep[] = [
  WELCOME_STEP,
  SIDEBAR_TOGGLE_STEP,
  navStep("/dashboard", "Panel de Control", "Verás tus citas de hoy, tus estadísticas del mes y tu actividad reciente."),
  dashboardStatsStep("Citas de hoy, citas de la semana, y tu tasa de asistencia del mes."),
  navStep("/appointments", "Gestión de Citas", "Consulta y gestiona tus propias citas desde la lista o el calendario."),
  appointmentsFiltersStep,
  navStep("/records", "Historial Clínico", "Consulta y sube documentos clínicos de tus pacientes."),
  navStep("/patients", "Pacientes", "Consulta la información de tus pacientes."),
  navStep("/treatments", "Tratamientos", "Da seguimiento a los tratamientos que has recetado."),
  navStep("/notifications", "Notificaciones", "Recibe recordatorios de citas y tu agenda diaria."),
  navStep("/profile", "Mi Perfil", "Edita tu nombre, correo y contraseña desde aquí. ¡Listo! Ya puedes explorar el resto por tu cuenta."),
];

export const getTourSteps = (role: string | null): TourStep[] => {
  if (role === "ADMIN") return ADMIN_TOUR_STEPS;
  if (role === "DOCTOR") return DOCTOR_TOUR_STEPS;
  return [];
};
