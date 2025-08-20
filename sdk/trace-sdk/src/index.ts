import { getAudioHash } from "./collection/audio/audioHash";
import { canPlay, checkWebPSupport, getAvailableFonts, getBarVisibility, getBrowserFeatureSupport, getColorDepth, getColorGamut, getFeaturePolicies, getNavigatorProperties, getTimeZone } from "./collection/browser";
import { getDeviceType } from "./collection/browser/deviceType";
import detectIncognito from "./collection/browser/incognito";
import { getPlatform } from "./collection/browser/platform";
import { getUserAgent } from "./collection/browser/userAgent";
import { getVendor } from "./collection/browser/vendor";
import { getCanvasHash } from "./collection/canvas/canvasHash";
import { MathFingerprint } from "./collection/math";
import { getWebGLInfo, getWebGLRendererInfo, getWebGLShaderPrecision } from "./collection/webgl";
import { generateWebGLHash } from "./collection/webgl/webglHash";
import { MediaSupport } from "./models";
import { postData, postAttributes } from "./services/httpService";
import * as murmurhash from 'murmurhash';

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

    const browserAttributes = [
        getDeviceType(),
        getPlatform(),
        getUserAgent(),
        getVendor(),
        checkWebPSupport(),
        getBrowserFeatureSupport(),
        getColorDepth(),
        getColorGamut(),
        getFeaturePolicies(),
        getNavigatorProperties(),
        getTimeZone(),
        getBarVisibility(),
        availableFonts
    ];


    const fingerprint: string = murmurhash.v3(
        [audioPrint, webGlPrint, canvasPrint, browserAttributes, videoAttributes, MathFingerprint(), getWebGLInfo(), getWebGLShaderPrecision(), getWebGLRendererInfo()].join('|')
    ).toString();
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
        await postData('fingerprint', fingerprint);
        await postAttributes('device_info', browserAttributes, fingerprint);

    } catch (error) {
        console.error('Error posting data:', error);
    }

    return {
        fingerprint,
        isIncognito: incognitoStatus
    };
}

export {
    FingerprintSDK
};