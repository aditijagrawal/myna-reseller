import { fn } from 'storybook/test';
import LeadCapture from './LeadCapture';

export default {
  title: 'Conversation Builder/Organisms/Drawer/Tools/Lead Capture',
  component: LeadCapture,
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
    title: 'Lead Capture',
  },
};
