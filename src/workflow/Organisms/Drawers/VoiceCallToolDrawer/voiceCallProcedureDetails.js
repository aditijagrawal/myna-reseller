import { getProcedureDetailContent } from '../../../services/procedureService.js';

/** Filled procedure detail for voice-call starting procedure preview (Figma reference). */
export const APPOINTMENT_CONFIRMATION_PROCEDURE_DETAIL = {
  id: 'Appointment confirmation',
  name: 'Appointment confirmation',
  whenToUse:
    'Use when the patient wants to book a new appointment or schedule a visit with a provider',
  contextChips: [
    { value: 'Provider_first_name', type: 'variable' },
    { value: 'Business_ID', type: 'variable' },
    { value: 'Products_list.PDF', type: 'attachment' },
    { value: 'www.aspendental.com', type: 'link' },
  ],
  moreContextCount: 25,
  procedureType: 'Inbound',
  stepsText: [
    '1. Step 1: Identify Patient',
    '• Ask: "Is this appointment for yourself or someone else?"assistant. How can I help you today?',
    '• Collect:',
    '- First name',
    '- Last name',
    '- DOB',
    '• Call {{Lookup_patients_list}} If patient exists:',
    '- Continue as existing patient',
    'If patient not found:',
    '- Continue as new patient',
    '2. Collect Missing Information',
  ].join('\n'),
};

const VOICE_CALL_PROCEDURE_DETAILS = {
  'Appointment confirmation': APPOINTMENT_CONFIRMATION_PROCEDURE_DETAIL,
};

export function getVoiceCallProcedureDetail(procedureId, product = 'healthcare') {
  if (VOICE_CALL_PROCEDURE_DETAILS[procedureId]) {
    return { ...VOICE_CALL_PROCEDURE_DETAILS[procedureId] };
  }
  return getProcedureDetailContent(procedureId, {}, product);
}
