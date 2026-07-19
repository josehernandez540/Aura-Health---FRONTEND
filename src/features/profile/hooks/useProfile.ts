import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMyProfile, updateMyProfile, type MyProfile } from "../services/profile.service";
import { profileFormSchema, type ProfileFormInput } from "../schemas/profile.schema";
import { useUIStore } from "../../../store/ui.store";

export const useProfile = () => {
  const showToast = useUIStore((state) => state.showToast);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", email: "" },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      reset({ name: data.name ?? "", email: data.email });
    } catch {
      showToast("No se pudo cargar tu perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const updated = await updateMyProfile(formData);
      setProfile(updated);
      reset({ name: updated.name ?? "", email: updated.email });
      showToast("Perfil actualizado correctamente", "success");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al actualizar el perfil";
      showToast(message, "error");
    }
  });

  return { profile, loading, register, errors, isSubmitting, onSubmit };
};
