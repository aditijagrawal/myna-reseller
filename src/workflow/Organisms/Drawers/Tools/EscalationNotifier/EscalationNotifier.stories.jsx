import { fn } from 'storybook/test';
import EscalationNotifier from './EscalationNotifier';

export default {
  title: 'Conversation Builder/Organisms/Drawer/Tools/Escalation Notifier',
  component: EscalationNotifier,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onBack: fn(),
    onSave: fn(),
  },
};

export const Default = {
  args: {
    title: 'Escalation Notifier',
  },
};
