import RoleGuard from '../../features/auth/RoleGuard';
import AuditTable from './AuditTable';

const AuditPage = () => {
  return (
    <RoleGuard roles="ADMIN" redirect>
      <AuditTable />
    </RoleGuard>
  );
};

export default AuditPage;