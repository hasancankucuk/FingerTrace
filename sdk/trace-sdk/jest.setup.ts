declare var global: any;

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

interface Window {
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
  OfflineAudioContext?: typeof OfflineAudioContext;
}

(window as Window).AudioContext = window.AudioContext || (window as any).webkitAudioContext;
(window as Window).OfflineAudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['./jest.setup.ts'], // Add this line
};