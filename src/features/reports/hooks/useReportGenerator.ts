import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportFiltersSchema, type ReportFiltersInput } from "../schemas/report.schema";
import {
  fetchReportSummary,
  generateConsolidatedReport,
  resolveReportDownloadError,
  type ReportSummary,
} from "../services/report.service";
import { useMedicos } from "../../doctor/hooks/useDoctorsList";
import { usePatientsList } from "../../patients/hooks/usePatientsList";
import { useUIStore } from "../../../store/ui.store";
import { downloadBlob, extractFilename } from "../../../utils/downloadBlob";

export const useReportGenerator = (onGenerated?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);

  const { medicos, loading: loadingMedicos } = useMedicos();
  const { patients, loading: loadingPatients } = usePatientsList();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFiltersInput>({
    resolver: zodResolver(reportFiltersSchema),
    mode: "onChange",
    defaultValues: { doctorId: "", patientId: "", startDate: "", endDate: "" },
  });

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const doctorOptions = [
    { value: "", label: "Todos los médicos" },
    ...medicos.filter((m) => m.is_active).map((m) => ({ value: m.id, label: m.name })),
  ];

  const patientOptions = [
    { value: "", label: "Todos los pacientes" },
    ...patients.filter((p) => p.is_active !== false).map((p) => ({ value: p.id, label: p.name })),
  ];

  const runPreview = handleSubmit(async (data) => {
    setPreviewLoading(true);
    setGenerateError(null);
    try {
      const result = await fetchReportSummary(data);
      setSummary(result);
    } catch (error) {
      const message = await resolveReportDownloadError(error, "No se pudo generar la vista previa");
      showToast(message, "error");
    } finally {
      setPreviewLoading(false);
    }
  });

  const runGenerate = handleSubmit(async (data) => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const { blob, contentDisposition } = await generateConsolidatedReport(data);
      const filename = extractFilename(contentDisposition, `reporte-clinico-${new Date().toISOString().slice(0, 10)}.pdf`);
      downloadBlob(blob, filename);
      showToast("El reporte se generó correctamente, la descarga comenzará en breve", "success");
      onGenerated?.();
    } catch (error) {
      const message = await resolveReportDownloadError(error, "Ocurrió un error inesperado al generar el reporte");
      setGenerateError(message);
    } finally {
      setGenerating(false);
    }
  });

  return {
    register,
    errors,
    doctorOptions,
    patientOptions,
    loadingOptions: loadingMedicos || loadingPatients,
    summary,
    previewLoading,
    generating,
    generateError,
    dismissGenerateError: () => setGenerateError(null),
    runPreview,
    runGenerate,
  };
};
