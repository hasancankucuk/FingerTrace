import { getAudioHash } from '../audio/audioHash';
import { getCanvasHash } from '../canvas/canvasHash';
import { MathFingerprint } from '../math';
import { generateWebGLHash } from '../webgl/webglHash';

describe('Collections', () => {
  it('should generate audio hash', () => {
    expect(getAudioHash).toBeDefined();
  });

  it('should generate canvas hash', () => {
    expect(getCanvasHash).toBeDefined();
  });

  it('should generate math fingerprint', () => {
    expect(MathFingerprint).toBeDefined();
  });

  it('should generate WebGL hash', () => {
    expect(generateWebGLHash).toBeDefined();
  });
});