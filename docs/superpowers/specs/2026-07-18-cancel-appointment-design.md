# Cancelar citas — Diseño

## Historia

Como administrador quiero cancelar citas para mantener control sobre la agenda.

## Contexto

El backend ya expone todo lo necesario, no requiere cambios:
- `PATCH /api/v1/appointments/:id/cancel` — cancela una cita. Body `{ reason: string }`, `reason` requerido (10–500 caracteres). Solo `ADMIN`. Solo permite cancelar citas en estado `SCHEDULED`; devuelve `400` si el motivo falta/es inválido o la cita no está en `SCHEDULED`, `404` si no existe. Notifica al paciente por email automáticamente (server-side, sin UI involucrada).

En el frontend ya existe la feature `appointments` (creada en la HU anterior): `appointment.schema.ts`, `appointment.service.ts`, `useAppointments.ts`, `AppointmentTable.tsx`, `CreateAppointmentModal.tsx`, `pages/Appointments.tsx`. Esta HU extiende esos mismos archivos siguiendo el patrón ya establecido, en vez de crear una feature nueva.

Decisión ya validada con el usuario: el botón "Cancelar" se **oculta** (no se deshabilita) en filas cuya cita no está en estado `SCHEDULED`, ya que el backend solo permite cancelar ese estado.

## Archivos

```
features/appointments/
  schemas/appointment.schema.ts       (+ cancelAppointmentSchema)
  services/appointment.service.ts     (+ cancelAppointment)
  hooks/useAppointments.ts            (+ useCancelAppointment)
  components/
    AppointmentTable.tsx              (+ columna Acciones)
    CancelAppointmentModal.tsx        (nuevo)
pages/Appointments.tsx                (+ estado isCancelOpen/selectedAppointment)
```

## Componentes

### `appointment.schema.ts` — `cancelAppointmentSchema`

Espejo del `cancelAppointment.schema.js` del backend:
- `reason`: string, requerido, mínimo 10 caracteres ("El motivo debe tener al menos 10 caracteres"), máximo 500.

### `appointment.service.ts` — `cancelAppointment`

```ts
export const cancelAppointment = async (id: string, reason: string) => {
  const { data } = await api.patch<{ message: string }>(`/appointments/${id}/cancel`, { reason });
  return data;
};
```

### `useAppointments.ts` — `useCancelAppointment(onSuccess)`

Mismo shape que `useCreateAppointment`: `react-hook-form` + `zodResolver(cancelAppointmentSchema)`. En éxito: `showToast("Cita cancelada correctamente", "success")`, `reset()`, invoca `onSuccess`. En error: lee `error.response?.data?.message` (cubre 400/403/404) y lo muestra con `showToast(..., "error")`, sin cerrar el modal.

### `CancelAppointmentModal.tsx`

Modal (`size="sm"`) con:
- Textarea "Motivo de cancelación" (obligatorio, con contador o al menos mensaje de error si falla el mínimo de 10 caracteres)
- Footer: botón "Cancelar" (cierra sin guardar) + botón "Confirmar cancelación" (`variant="danger"`, `isLoading`)

Recibe `appointmentId` por props (o `null` cuando está cerrado).

### `AppointmentTable.tsx`

Nueva columna "Acciones": botón "Cancelar" (`variant="danger"` o `ghost`), visible solo si `hasRole(['ADMIN'])` **y** `appointment.status === 'SCHEDULED'`. Al hacer click invoca `onCancel(appointment)` (prop nueva) que la página usa para abrir el modal con el id correspondiente.

### `pages/Appointments.tsx`

Añade `isCancelOpen`, `selectedAppointmentId` (estado local, mismo patrón que `Patients.tsx` con `isEditOpen`/`selectedPatient`). Pasa `onCancel` a `AppointmentTable` y renderiza `CancelAppointmentModal` con `onSuccess={fetchAppointments}`.

## Manejo de errores

| Caso | Origen | Manejo en UI |
|---|---|---|
| Motivo vacío o < 10 caracteres | Zod (cliente) | Mensaje inline bajo el textarea, no llega a la red |
| Motivo inválido / cita no está en SCHEDULED | Servidor, 400 | Toast de error con el mensaje del backend, modal permanece abierto |
| Rol insuficiente | Servidor, 403 | Toast de error (no debería ocurrir en la práctica: el botón ya está oculto para no-ADMIN) |
| Cita no encontrada | Servidor, 404 | Toast de error |
| Éxito | Servidor, 200 | Toast de confirmación, modal se cierra, tabla se refresca (fila pasa a badge "Cancelada") |

## Fuera de alcance

- Reprogramar o revertir una cancelación (endpoints ya existen en el backend, no forman parte de esta HU).
- Notificación al paciente (la maneja el backend automáticamente).
