# Programar citas desde la interfaz — Diseño

## Historia

Como administrador quiero programar citas desde la interfaz para asignar pacientes a médicos sin conflictos.

## Contexto

El backend ya expone todo lo necesario:
- `POST /api/v1/appointments` — crea una cita, valida `doctorId`, `patientId`, `date` (no pasada), `startTime`/`endTime` (`HH:MM`, `endTime > startTime`), `notes` (opcional, máx. 500 caracteres). Devuelve `409` si el médico ya tiene una cita `SCHEDULED` que se solapa (REQ-05, ya resuelto server-side).
- `GET /api/v1/appointments` — lista citas (paginado, filtros `doctorId`, `patientId`, `date`, `status`).

En el frontend, "Citas" ya existe como entrada del sidebar (`path: /appointments`) pero sin `component` asociado — no hay nada construido. El resto de features (`doctor`, `patients`) siguen un patrón consistente: página de listado + modal "Crear" + hook + servicio + schema Zod, todo en TypeScript. Replicamos ese mismo patrón para `appointments`.

Decisiones ya validadas con el usuario:
- Archivos en `.ts`/`.tsx` (no `.jsx`/`.js`), para mantener consistencia con `doctor`/`patients`.
- Patrón modal-sobre-listado (`/appointments` con botón "Nueva Cita"), no una ruta dedicada `/appointments/create` — igual que Doctors/Patients.
- Selector de hora con dos inputs simples (`startTime`/`endTime`), no una grilla de horarios — el backend no expone un endpoint de disponibilidad, y la épica solo pide los dos campos.
- Se incluye un campo opcional de notas/motivo, ya que el backend lo soporta.

## Archivos a crear

```
features/appointments/
  schemas/appointment.schema.ts
  services/appointment.service.ts
  hooks/useAppointments.ts
  components/
    AppointmentTable.tsx
    CreateAppointmentModal.tsx
pages/Appointments.tsx
```

Y una modificación:
```
components/layout/SideBar/sidebar.config.ts  — agregar component: AppointmentsPage al item "Citas"
```

## Componentes

### `appointment.schema.ts`

Espejo del schema Zod del backend (`createAppointment.schema.js`), para dar feedback inmediato en el cliente antes de golpear la red:
- `doctorId`: string, requerido ("El médico es requerido")
- `patientId`: string, requerido ("El paciente es requerido")
- `date`: string, requerido, no puede ser fecha pasada
- `startTime` / `endTime`: string, requerido, formato `HH:MM`
- `notes`: string, opcional, máx. 500 caracteres
- `.refine`: `endTime > startTime`

### `appointment.service.ts`

```ts
export const createAppointment = (payload: CreateAppointmentPayload) =>
  api.post("/appointments", payload);

export const getAppointments = () => api.get("/appointments");
```

Mismo estilo que `doctor.service.ts` / `patient.services.ts` (instancia `api` compartida, que ya apunta a `/api/v1`).

### `useAppointments.ts`

Dos hooks en el mismo archivo (nombre pedido por la épica), siguiendo el split que ya usan `patients`/`doctor`:

- `useAppointmentsList()` — igual a `usePatientsList`: `fetchAppointments`, `appointments`, `loading`, toast en error.
- `useCreateAppointment(onSuccess)` — igual a `usePatient`: `react-hook-form` + `zodResolver(createAppointmentSchema)`. En éxito: `showToast(..., "success")`, `reset()`, invoca `onSuccess`. En error: lee `error.response?.data?.message` (cubre 400/404/409 del backend) y lo muestra con `showToast(..., "error")`, sin cerrar el modal.

### `CreateAppointmentModal.tsx`

Modal (`<Modal>` existente) con formulario:
- `SelectInput` Médico — opciones desde `useMedicos()` (hook ya existente de `doctor` feature), filtrando `is_active`.
- `SelectInput` Paciente — opciones desde `usePatientsList()` (hook ya existente), filtrando `is_active`.
- `DateInput` Fecha
- `Input type="time"` Hora inicio
- `Input type="time"` Hora fin
- `Input` (o textarea) Notas — opcional

Mismo layout/footer que `CreatePatientModal.tsx` (botón Cancelar + botón submit con `isLoading`).

### `AppointmentTable.tsx` + `pages/Appointments.tsx`

`Appointments.tsx` sigue el patrón de `Patients.tsx`: `PageHeader` con botón "Nueva Cita" que abre el modal, `AppointmentTable` (usa el `<DataTable>` compartido) con columnas Paciente / Médico / Fecha / Hora / Estado, estado `isCreateOpen`, y `onSuccess={fetchAppointments}` para refrescar la tabla tras crear.

## Manejo de errores

| Caso | Origen | Manejo en UI |
|---|---|---|
| Campo vacío / formato inválido | Zod (cliente) | Mensaje inline bajo el campo, no llega a la red |
| Fecha pasada, hora fin ≤ hora inicio | Zod (cliente) + Zod (servidor, 400) | Mensaje inline / toast si pasa validación cliente pero falla en servidor |
| Médico o paciente no encontrado | Servidor, 404 | Toast de error con el mensaje del backend |
| Solapamiento de horario (REQ-05) | Servidor, 409 | Toast de error con el mensaje del backend, modal permanece abierto |
| Éxito | Servidor, 200 | Toast de confirmación, modal se cierra, tabla se refresca |

## Fuera de alcance

- Grilla visual de horarios ocupados/disponibles (requeriría un endpoint de disponibilidad que no existe hoy).
- Ruta dedicada `/appointments/create`.
- Edición/cancelación/reprogramación de citas (ya existen endpoints backend para esto, pero no están en esta épica).
