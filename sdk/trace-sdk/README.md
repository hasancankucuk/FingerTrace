# Trace SDK

A comprehensive browser fingerprinting library that generates unique device fingerprints and detects incognito/private browsing mode.

## Features

- **Audio Fingerprinting**: Generates unique fingerprints based on audio rendering characteristics
- **Canvas Fingerprinting**: Creates fingerprints from HTML5 canvas rendering
- **WebGL Fingerprinting**: Analyzes WebGL capabilities and rendering
- **Math Fingerprinting**: Uses mathematical precision functions for identification
- **Browser Detection**: Comprehensive browser and device information collection
- **Incognito Detection**: Detects private/incognito browsing modes
- **Media Support Analysis**: Checks for various audio/video format support
- **Device Information**: Collects platform, user agent, and hardware details

## Installation

```bash
npm install trace-sdk
```

## Usage

### Basic Usage

```javascript
import FingerprintSDK, { SetWorkspaceId, SetApiKey } from 'trace-sdk';

// Configure your workspace and API key
SetWorkspaceId('your-workspace-id');
SetApiKey('your-api-key');

// Generate fingerprint
const result = await FingerprintSDK();
console.log('Fingerprint:', result.fingerprint);
console.log('Is Incognito:', result.isIncognito);
```

### Browser (IIFE) Usage

```html
<script src="path/to/trace-sdk.min.js"></script>
<script>
  // SDK is available as FingerprintIO global
  FingerprintIO.SetWorkspaceId('your-workspace-id');
  FingerprintIO.SetApiKey('your-api-key');
  
  FingerprintIO.default().then(result => {
    console.log('Fingerprint:', result.fingerprint);
    console.log('Is Incognito:', result.isIncognito);
  });
</script>
```

## API Reference

### Main Functions

#### `FingerprintSDK()`
Generates a unique device fingerprint and returns detection results.

**Returns:**
```typescript
{
  fingerprint: string;    // 30-character unique fingerprint
  isIncognito: boolean;   // true if private/incognito mode detected
}
```

#### `SetWorkspaceId(id: string)`
Sets the workspace ID for API communication.

#### `SetApiKey(key: string)`
Sets the API key for authentication.

## Fingerprint Components

The SDK combines multiple fingerprinting techniques:

### Audio Fingerprinting
- Uses Web Audio API to analyze audio rendering characteristics
- Generates hash based on audio context properties

### Canvas Fingerprinting
- Renders text and shapes on HTML5 canvas
- Creates hash from pixel data variations

### WebGL Fingerprinting
- Analyzes WebGL renderer information
- Collects shader precision and capabilities

### Browser Information
- Device type detection (mobile/desktop)
- Platform and operating system
- User agent string
- Browser vendor information
- Color depth and gamut support
- Feature policy analysis
- Timezone information

### Media Support
Checks support for various formats:
- **Video**: AVI, DIF, DV, M4U, M4V, MOV, MP4, MPG, WMV
- **Audio**: AAC, AC3, AIFF, FLAC, M4A, MP3, OGG, WAV, WEBM

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Privacy Considerations

This library is designed for legitimate use cases such as:
- Fraud prevention
- Analytics and user experience optimization
- Security enhancement

Please ensure compliance with privacy regulations (GDPR, CCPA, etc.) and obtain proper user consent when required.

## Development

### Building

```bash
npm run build
```

### Running Tests with Cypress

```bash
npm run cypress:open
npm run cypress:run
```

## Output Formats

The SDK builds multiple output formats:

- **ES Module**: `dist/index.esm.js`
- **CommonJS**: `dist/index.cjs.js`
- **IIFE (Browser)**: `dist/trace-sdk.min.js`
- **Type Definitions**: `dist/index.d.ts`

## License

ISC

## Version

Current version: 1.2.0

