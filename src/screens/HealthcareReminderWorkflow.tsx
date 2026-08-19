/**
 * HealthcareReminderWorkflow
 *
 * Orchestrates the custom healthcare Reminder agent workflow:
 * - HealthcareReminderCanvas (view-only or edit)
 * - ReminderToolDrawer (opens when editing the Reminder tool)
 * - InitiateVoiceCallDrawer (opens when editing the voice call tool)
 */
import { useState } from 'react'
import { HealthcareReminderCanvas } from './HealthcareReminderCanvas'
import { ReminderToolDrawer } from '../components/ReminderToolDrawer/ReminderToolDrawer'
import { InitiateVoiceCallDrawer } from '../components/InitiateVoiceCallDrawer/InitiateVoiceCallDrawer'

interface Props {
  viewOnly: boolean
  instanceName: string
  onEdit?: () => void
  onClose?: () => void
}

export function HealthcareReminderWorkflow({ viewOnly, instanceName, onEdit, onClose }: Props) {
  const [reminderDrawerOpen, setReminderDrawerOpen] = useState(false)
  const [voiceCallDrawerOpen, setVoiceCallDrawerOpen] = useState(false)

  return (
    <>
      <HealthcareReminderCanvas
        viewOnly={viewOnly}
        instanceName={instanceName}
        onEdit={onEdit}
        onClose={onClose}
        onOpenReminderTool={() => setReminderDrawerOpen(true)}
        onOpenVoiceCallTool={() => setVoiceCallDrawerOpen(true)}
      />
      <ReminderToolDrawer
        open={reminderDrawerOpen}
        onClose={() => setReminderDrawerOpen(false)}
      />
      <InitiateVoiceCallDrawer
        open={voiceCallDrawerOpen}
        onClose={() => setVoiceCallDrawerOpen(false)}
      />
    </>
  )
}
