export interface OutboundLogRow extends Record<string, unknown> {
  id: string
  timestamp: string
  status: 'Complete' | 'Failed' | 'In progress'
  contact: string
  channel: 'Voice' | 'SMS'
}

export const RECALL_LOGS: OutboundLogRow[] = [
  { id: 'r1',  timestamp: 'Jun 15, 2026, 10:14 am', status: 'Complete',    contact: 'Dana Whitfield',       channel: 'Voice' },
  { id: 'r2',  timestamp: 'Jun 15, 2026, 10:02 am', status: 'Failed',      contact: '+1 (628) 555-0110',    channel: 'Voice' },
  { id: 'r3',  timestamp: 'Jun 14, 2026, 4:47 pm',  status: 'Complete',    contact: 'Robert Cho',           channel: 'Voice' },
  { id: 'r4',  timestamp: 'Jun 14, 2026, 3:30 pm',  status: 'In progress', contact: 'Elena Sokolova',       channel: 'Voice' },
  { id: 'r5',  timestamp: 'Jun 14, 2026, 2:11 pm',  status: 'Complete',    contact: '+1 (310) 555-0190',    channel: 'SMS'   },
  { id: 'r6',  timestamp: 'Jun 13, 2026, 11:55 am', status: 'Failed',      contact: 'Marcus Rivera',        channel: 'Voice' },
  { id: 'r7',  timestamp: 'Jun 13, 2026, 9:38 am',  status: 'Complete',    contact: '+1 (415) 555-0247',    channel: 'Voice' },
  { id: 'r8',  timestamp: 'Jun 12, 2026, 5:20 pm',  status: 'Complete',    contact: 'Priya Nair',           channel: 'Voice' },
  { id: 'r9',  timestamp: 'Jun 12, 2026, 3:05 pm',  status: 'Failed',      contact: '+1 (512) 555-0183',    channel: 'Voice' },
  { id: 'r10', timestamp: 'Jun 11, 2026, 10:44 am', status: 'Complete',    contact: 'James Okafor',         channel: 'SMS'   },
]

export const REVENUE_LOGS: OutboundLogRow[] = [
  { id: 'rv1',  timestamp: 'Jun 16, 2026, 9:52 am',  status: 'Complete',    contact: 'Sofia Nguyen',         channel: 'Voice' },
  { id: 'rv2',  timestamp: 'Jun 16, 2026, 9:31 am',  status: 'Failed',      contact: '+1 (773) 555-0164',    channel: 'Voice' },
  { id: 'rv3',  timestamp: 'Jun 15, 2026, 3:48 pm',  status: 'In progress', contact: 'Tyler Brooks',          channel: 'Voice' },
  { id: 'rv4',  timestamp: 'Jun 15, 2026, 2:17 pm',  status: 'Complete',    contact: '+1 (213) 555-0291',    channel: 'SMS'   },
  { id: 'rv5',  timestamp: 'Jun 14, 2026, 11:03 am', status: 'Complete',    contact: 'Aisha Patel',          channel: 'Voice' },
  { id: 'rv6',  timestamp: 'Jun 14, 2026, 10:22 am', status: 'Failed',      contact: '+1 (469) 555-0137',    channel: 'Voice' },
  { id: 'rv7',  timestamp: 'Jun 13, 2026, 4:55 pm',  status: 'Complete',    contact: 'Carlos Mendez',        channel: 'Voice' },
  { id: 'rv8',  timestamp: 'Jun 13, 2026, 2:40 pm',  status: 'Complete',    contact: '+1 (202) 555-0318',    channel: 'SMS'   },
  { id: 'rv9',  timestamp: 'Jun 12, 2026, 1:15 pm',  status: 'Failed',      contact: 'Hannah Lee',           channel: 'Voice' },
  { id: 'rv10', timestamp: 'Jun 11, 2026, 10:08 am', status: 'Complete',    contact: '+1 (832) 555-0074',    channel: 'Voice' },
]

export const TREATMENT_PLAN_LOGS: OutboundLogRow[] = [
  { id: 'tp1',  timestamp: 'Jun 16, 2026, 11:27 am', status: 'Complete',    contact: 'Evelyn Torres',        channel: 'Voice' },
  { id: 'tp2',  timestamp: 'Jun 16, 2026, 10:48 am', status: 'In progress', contact: '+1 (347) 555-0229',    channel: 'Voice' },
  { id: 'tp3',  timestamp: 'Jun 15, 2026, 4:12 pm',  status: 'Failed',      contact: 'David Kim',            channel: 'Voice' },
  { id: 'tp4',  timestamp: 'Jun 15, 2026, 2:55 pm',  status: 'Complete',    contact: '+1 (617) 555-0156',    channel: 'SMS'   },
  { id: 'tp5',  timestamp: 'Jun 14, 2026, 12:30 pm', status: 'Complete',    contact: 'Natalie Grant',        channel: 'Voice' },
  { id: 'tp6',  timestamp: 'Jun 14, 2026, 9:44 am',  status: 'Failed',      contact: '+1 (503) 555-0082',    channel: 'Voice' },
  { id: 'tp7',  timestamp: 'Jun 13, 2026, 3:18 pm',  status: 'Complete',    contact: 'Omar Hassan',          channel: 'Voice' },
  { id: 'tp8',  timestamp: 'Jun 13, 2026, 11:05 am', status: 'Complete',    contact: '+1 (404) 555-0211',    channel: 'SMS'   },
  { id: 'tp9',  timestamp: 'Jun 12, 2026, 4:37 pm',  status: 'Failed',      contact: 'Lily Zhang',           channel: 'Voice' },
  { id: 'tp10', timestamp: 'Jun 11, 2026, 2:22 pm',  status: 'Complete',    contact: '+1 (720) 555-0143',    channel: 'Voice' },
]

export const DENTAL_OUTBOUND_LOGS: Record<string, OutboundLogRow[]> = {
  'Recall agent':         RECALL_LOGS,
  'Revenue agent':        REVENUE_LOGS,
  'Treatment plan agent': TREATMENT_PLAN_LOGS,
}
