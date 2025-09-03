import { getAudioHash } from "./collection/audio/audioHash";
import { canPlay, checkWebPSupport, getAvailableFonts, getBarVisibility, getBrowserFeatureSupport, getColorDepth, getColorGamut, getFeaturePolicies, getNavigatorProperties, getTimeZone } from "./collection/browser";
import { getDeviceType } from "./collection/browser/deviceType";
import detectIncognito from "./collection/browser/incognito";
import { getPlatform } from "./collection/browser/platform";
import { getUserAgent } from "./collection/browser/userAgent";
import { getVendor } from "./collection/browser/vendor";
import { getCanvasHash } from "./collection/canvas/canvasHash";
import { getClientRects } from "./collection/clientRects/getClientRects";
import { MathFingerprint } from "./collection/math";
import { getWebGLInfo, getWebGLRendererInfo, getWebGLShaderPrecision } from "./collection/webgl";
import { generateWebGLHash } from "./collection/webgl/webglHash";
import { MediaSupport } from "./models";
import { postData, postAttributes } from "./services/httpService";
import * as murmurhash from 'murmurhash';

let workspaceId: string;
let apiKey: string;

const SetWorkspaceId = (id: string) => {
    workspaceId = id;
}

const SetApiKey = (key: string) => {
    apiKey = key;
}

const generateFingerprints = async (): Promise<string> => {
    const audioPrint = new Promise<string>((resolve, reject) => {
        getAudioHash.run((fingerprint: string) => {
            if (fingerprint) {
                resolve(fingerprint);
            } else {
                reject(new Error('Failed to generate fingerprint'));
            }
        }, true);
    });
    const webGlPrint = generateWebGLHash();
    const canvasPrint = getCanvasHash();
    const videoAttributes = {
        AVI: canPlay(MediaSupport.AVI),
        DIF: canPlay(MediaSupport.DIF),
        DV: canPlay(MediaSupport.DV),
        M4U: canPlay(MediaSupport.M4U),
        M4V: canPlay(MediaSupport.M4V),
        MOV: canPlay(MediaSupport.MOV),
        QT: canPlay(MediaSupport.QT),
        MP4: canPlay(MediaSupport.MP4),
        MPE: canPlay(MediaSupport.MPE),
        OGG: canPlay(MediaSupport.OGG),
        WEBM: canPlay(MediaSupport.WEBM),
        HLS: canPlay(MediaSupport.HLS)
    };
    const availableFonts = await getAvailableFonts();
    const mathPrint = MathFingerprint();
    const clientRectFp = getClientRects();

    const hash1 = murmurhash.v3([audioPrint, webGlPrint, canvasPrint, clientRectFp].join('|'));
    const hash2 = murmurhash.v3([videoAttributes, availableFonts, mathPrint].join('|'));
    const hash3 = murmurhash.v3([getWebGLInfo(), getWebGLRendererInfo(), getWebGLShaderPrecision()].join('|'));

    let fingerprint = (hash1.toString(36) + hash2.toString(36) + hash3.toString(36));

    if (fingerprint.length > 30) {
        fingerprint = fingerprint.slice(0, 30);
    } else if (fingerprint.length < 30) {
        let idx = 0;
        while (fingerprint.length < 30) {
            const extra = murmurhash.v3(fingerprint + idx).toString(36);
            fingerprint += extra;
            idx++;
        }
        fingerprint = fingerprint.slice(0, 30);
    }

    return fingerprint;
}

export default async function FingerprintSDK() {
    const isIncognito = async () => {
        const result = await detectIncognito();
        return result.isPrivate;
    };

    const fingerprint = await generateFingerprints();
    const incognitoStatus = await isIncognito();

    const browserAttributes = {
        fingerprint: fingerprint,
        device_type: getDeviceType() ? getDeviceType().toString() : 'unknown',
        platform: getPlatform(),
        user_agent: getUserAgent(),
        vendor: getVendor(),
        webp_support: checkWebPSupport(),
        browser_feature_support: getBrowserFeatureSupport(),
        color_depth: getColorDepth().toString(),
        color_gamut: getColorGamut(),
        feature_policies: getFeaturePolicies(),
        navigator_properties: getNavigatorProperties(),
        time_zone: getTimeZone(),
        bar_visibility: getBarVisibility(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    try {
        await postData('fingerprints', fingerprint, workspaceId, apiKey);
        await postAttributes('deviceinfo', browserAttributes, fingerprint, workspaceId, apiKey);

    } catch (error) {
        console.error('Error posting data:', error);
    }

    return {
        fingerprint,
        isIncognito: incognitoStatus
    };
}

export {
    FingerprintSDK,
    SetWorkspaceId,
    SetApiKey
};