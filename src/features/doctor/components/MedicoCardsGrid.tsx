import React, { useMemo } from "react";
import Button from "../../../components/ui/Button/Button";
import "./medicoCards.css";

const MedicoCardsGrid = ({ medicos, filters, loading, onToggleStatus, onView, onEdit}) => {
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
  };

  const filteredMedicos = useMemo(() => {
    return medicos
      .filter((m) => {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          m.name.toLowerCase().includes(search) ||
          (m.users?.email || "").toLowerCase().includes(search) ||
          (m.license || "").toLowerCase().includes(search);

        const matchesSpec =
          filters.specialization === "" ||
          m.specialization === filters.specialization;

        const statusActive = filters.status === "active";
        const matchesStatus =
          filters.status === "" || m.is_active === statusActive;

        return matchesSearch && matchesSpec && matchesStatus;
      })
      .slice(0, 3);
  }, [medicos, filters]);

  if (loading) return <div className="p-4 text-white">Cargando médicos...</div>;
  if (filteredMedicos.length === 0)
    return (
      <div className="p-4 text-muted">No se encontraron coincidencias.</div>
    );

  return (
    <div className="grid-3">
      {filteredMedicos.map((medico) => (
        <div
          key={medico.id}
          className={`doctor-card ${!medico.is_active ? "inactive" : ""}`}
        >
          <div className="doctor-card-top">
            <div className="doctor-avatar">{getInitials(medico.name)}</div>
            <div className="doctor-meta">
              <h3>{medico.name}</h3>
              <span>{medico.specialization}</span>
              <br />
              <span
                className={`badge ${medico.is_active ? "badge-green" : "badge-gray"}`}
                style={{ marginTop: "4px" }}
              >
                {medico.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={() => onView(medico.id)}>
                Ver
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted">
            Lic: {medico.license || "MED-00000"} · {medico.citas_hoy || 0} citas
            hoy
          </div>

          <div className="doctor-stats">
            <div className="doctor-stat">
              <div className="val">{medico.total_pacientes || 0}</div>
              <div className="lbl">Pacientes</div>
            </div>
            <div className="doctor-stat">
              <div className="val">{medico.experience_years || "0"}</div>
              <div className="lbl">Años exp.</div>
            </div>
            <div className="doctor-stat">
              <div className="val">{medico.rating || "0.0"}</div>
              <div className="lbl">Rating</div>
            </div>
          </div>

          <div className="flex gap-2" style={{ marginTop: "auto" }}>
            <Button
              variant={medico.is_active ? "ghost" : "primary"}
              size="sm"
              style={{ flex: 1 }}
              onClick={() => onToggleStatus(medico.id)}
            >
              {medico.is_active ? "Inactivar" : "Activar"}
            </Button>
            <Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => onEdit(medico.id)}>
              <img src="icons/edit.svg" className="icon-img-color" height={14}/> Editar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicoCardsGrid;
