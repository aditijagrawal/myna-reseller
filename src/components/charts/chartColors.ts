// Shared chart palette — derived from the app's design tokens so charts stay
// on-brand. Reused across all report/Outcomes pages.
export const chartColors = {
  resolved: '#4cae3d',
  escalated: '#f5a623',
  unresolved: '#de1b0c',
  routed: '#8bc34a',
  unresponded: '#d4d4d4',
  channel: {
    sms: '#7c4dff',
    email: '#e056c7',
    call: '#f5b301',
  },
  positive: '#377e2c',
  negative: '#de1b0c',
  blue: '#1976d2',
  axis: '#8f8f8f',
  grid: '#eaeaea',
  // General-purpose categorical series.
  categorical: ['#4cae3d', '#f5a623', '#de1b0c', '#7c4dff', '#1976d2', '#00bcd4', '#e056c7', '#8bc34a'],
}
