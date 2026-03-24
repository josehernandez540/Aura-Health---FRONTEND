import AuditTable from "../features/audit/component/AuditTable";
import PageHeader from "../components/common/PageHeader";

const AuditPage = () => {
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <PageHeader
        title="Registro de Auditoría"
        subtitle="Monitoreo de eventos del sistema"
      />

      <AuditTable />
    </div>
  );
};

export default AuditPage;