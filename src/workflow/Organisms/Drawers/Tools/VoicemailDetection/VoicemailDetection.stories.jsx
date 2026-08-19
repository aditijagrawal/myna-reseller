import { fn } from 'storybook/test';
import VoicemailDetection from './VoicemailDetection';

export default {
  title: 'Conversation Builder/Organisms/Drawer/Tools/Voicemail Detection',
  component: VoicemailDetection,
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
    title: 'Voicemail detection',
  },
};
