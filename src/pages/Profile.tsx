import React from "react";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/ui/Inputs/Input";
import Button from "../components/ui/Button/Button";
import ChangePasswordForm from "../features/auth/change-password/ChangePasswordForm";
import { useProfile } from "../features/profile/hooks/useProfile";
import "./Profile.css";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  DOCTOR: "Médico",
};

const ProfilePage: React.FC = () => {
  const { profile, loading, register, errors, isSubmitting, onSubmit } = useProfile();

  return (
    <>
      <PageHeader title="Mi Perfil" subtitle="Administra tu información personal y la seguridad de tu cuenta" />

      {loading || !profile ? (
        <p className="profile-loading">Cargando perfil...</p>
      ) : (
        <div className="profile-grid">
          <div className="profile-card">
            <h3 className="profile-card-title">Información personal</h3>

            <span className="profile-role-badge">{ROLE_LABEL[profile.role] ?? profile.role}</span>

            <form onSubmit={onSubmit} className="profile-form">
              <Input
                label="Nombre completo"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Correo electrónico"
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />

              {profile.doctor && (
                <div className="profile-readonly-grid">
                  <div className="form-group">
                    <label className="form-label">Especialidad</label>
                    <p className="profile-readonly-value">
                      {profile.doctor.specialization ?? "Sin especialidad"}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">N° de Licencia</label>
                    <p className="profile-readonly-value">
                      {profile.doctor.licenseNumber ?? "N/A"}
                    </p>
                  </div>

                  <p className="profile-readonly-hint">
                    La especialidad y el número de licencia solo pueden ser modificados por un administrador.
                  </p>
                </div>
              )}

              <Button type="submit" isLoading={isSubmitting} style={{ width: "auto" }}>
                Guardar cambios
              </Button>
            </form>
          </div>

          <div className="profile-card">
            <h3 className="profile-card-title">Seguridad de la cuenta</h3>
            <p className="profile-card-subtitle">Actualiza tu contraseña para mantener tu cuenta segura</p>
            <ChangePasswordForm variant="embedded" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
