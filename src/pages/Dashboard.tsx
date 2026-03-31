import React from "react";
import PageHeader from "../components/common/PageHeader";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <PageHeader 
        title="Panel de Control" 
        subtitle="Resumen general de Aura Health"
      />
      <div className="p-6">
        <div className="grid-3">
          <div className="doctor-card">
            <h3>Bienvenido</h3>
            <p className="text-muted">Selecciona una opción del menú para comenzar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;