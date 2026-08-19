import { fn } from 'storybook/test';
import LeadQualification from './LeadQualification';

export default {
  title: 'Conversation Builder/Organisms/Drawer/Tools/Lead Qualification',
  component: LeadQualification,
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
    title: 'Lead Qualification',
  },
};
