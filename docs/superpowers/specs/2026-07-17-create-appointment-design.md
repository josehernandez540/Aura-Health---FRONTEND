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
- Se incluye un campo opcional de notas/motivo, ya que el backend lo soporta.

**Revisión (2026-07-18):** el usuario compartió un mockup de referencia y pidió que el modal se vea exactamente así — reemplaza la decisión original de "dos inputs de hora simples" por una **grilla de horarios** (`Horario disponible`) que marca slots ocupados/disponibles/seleccionado. El backend no expone un endpoint de disponibilidad, así que la ocupación se calcula en el cliente a partir de `GET /appointments?doctorId&date` (ver sección "Cálculo de disponibilidad" más abajo). Al elegir un slot se derivan `startTime`/`endTime` automáticamente (bloques de 30 min) — el usuario ya no escribe la hora a mano.

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

export const getAppointments = (params?: { doctorId?: string; date?: string }) =>
  api.get("/appointments", { params });
```

Mismo estilo que `doctor.service.ts` / `patient.services.ts` (instancia `api` compartida, que ya apunta a `/api/v1`). `getAppointments` se reutiliza tanto para la tabla del listado (sin params) como para calcular disponibilidad (con `doctorId` + `date`).

### `useAppointments.ts`

Tres hooks en el mismo archivo (nombre pedido por la épica), siguiendo el split que ya usan `patients`/`doctor`:

- `useAppointmentsList()` — igual a `usePatientsList`: `fetchAppointments`, `appointments`, `loading`, toast en error.
- `useAvailableSlots(doctorId, date)` — cuando ambos están presentes, llama `getAppointments({ doctorId, date })`, genera la lista fija de slots del día (ver abajo) y marca como ocupado cualquier slot que se solape con una cita `SCHEDULED` devuelta. Si falta `doctorId` o `date`, devuelve `slots: []` (la UI muestra el placeholder "— Selecciona médico primero —").
- `useCreateAppointment(onSuccess)` — igual a `usePatient`: `react-hook-form` + `zodResolver(createAppointmentSchema)`. En éxito: `showToast(..., "success")`, `reset()`, invoca `onSuccess`. En error: lee `error.response?.data?.message` (cubre 400/404/409 del backend) y lo muestra con `showToast(..., "error")`, sin cerrar el modal.

### Cálculo de disponibilidad (grilla de horarios)

Slots fijos de 30 min, horario de clínica con descanso de almuerzo (igual al mockup): `07:00, 07:30, 08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 14:00, 14:30`.

Para cada slot `[start, start+30min]`, se marca **ocupado** si se solapa con alguna cita `SCHEDULED` del médico ese día (mismo criterio de solapamiento que ya usa el backend). Un slot ocupado se deshabilita (no clickeable). Al hacer click en un slot disponible, se marca como **seleccionado** y se setean internamente `startTime`/`endTime` del formulario (el usuario no los escribe).

Esto es un cálculo derivado en el cliente, puramente para UX — la fuente de verdad del conflicto sigue siendo la validación `409` del backend en el `POST`.

### `CreateAppointmentModal.tsx`

Modal (`<Modal>` existente, tamaño `lg`) con:
- Título: "🗓️ Nueva Cita — REQ-04 / REQ-05"
- Banner informativo (componente `Alert` existente, variante info): "REQ-05: El sistema valida automáticamente que no exista solapamiento de horarios."
- `SelectInput` Paciente — opciones desde `usePatientsList()` (hook ya existente), filtrando `is_active`.
- `SelectInput` Médico — opciones desde `useMedicos()` (hook ya existente de `doctor` feature), filtrando `is_active`.
- `DateInput` Fecha
- Sección "Horario disponible":
  - Si falta médico o fecha: caja placeholder "— Selecciona médico primero —"
  - Si ambos están presentes: grilla de botones de slot (3 columnas), estilo por estado (ocupado = borde/fondo rojo y disabled, seleccionado = borde/fondo azul, disponible = borde neutro)
  - Leyenda: "🔴 Ocupado 🔵 Seleccionado Blanco = Disponible — REQ-05: sin solapamiento"
- Textarea "Motivo de la cita" (opcional)
- Footer: botón Cancelar + botón submit ("Crear Cita") con `isLoading`

El submit queda deshabilitado hasta que haya un slot seleccionado (no tiene sentido enviar sin `startTime`/`endTime`).

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

- Ruta dedicada `/appointments/create`.
- Edición/cancelación/reprogramación de citas (ya existen endpoints backend para esto, pero no están en esta épica).
- Slots configurables por médico (horario/duración de cita distintos por especialidad): se usa una única grilla fija para todos los médicos.
