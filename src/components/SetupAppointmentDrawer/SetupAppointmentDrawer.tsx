import { FormDrawer } from '../FormDrawer/FormDrawer'
import type { FormField } from '../FormDrawer/FormDrawer.types'
import { SetupAppointmentDrawerProps } from './SetupAppointmentDrawer.types'

const FIELDS: FormField[] = [
  { key: 'rep', label: 'Customer rep', type: 'select', placeholder: 'Select customer rep', options: ['Auto-assign', 'Smith', 'Johnson', 'Williams', 'Brown'] },
  { key: 'type', label: 'Appointment type', type: 'select', placeholder: 'Select appointment type', options: ['Test drive', 'Service', 'Sales consultation', 'Trade-in appraisal'] },
  { key: 'date', label: 'Date', type: 'select', placeholder: 'Pick a date', options: ['Today', 'Tomorrow', 'Jun 05, 2026', 'Jun 06, 2026', 'Jun 07, 2026'] },
  { key: 'time', label: 'Time', type: 'select', placeholder: 'Pick a time', options: ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'] },
]

export function SetupAppointmentDrawer({ open, onClose, onOfferSlot }: SetupAppointmentDrawerProps) {
  return (
    <FormDrawer
      open={open}
      title="Setup appointment"
      fields={FIELDS}
      submitLabel="Offer slot"
      requiredKeys={['type', 'date', 'time']}
      initialValues={{ rep: 'Auto-assign' }}
      onClose={onClose}
      onSubmit={(values) =>
        onOfferSlot({
          rep: values.rep ?? '',
          type: values.type ?? '',
          date: values.date ?? '',
          time: values.time ?? '',
        })
      }
    />
  )
}
