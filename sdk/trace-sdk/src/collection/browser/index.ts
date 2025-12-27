import { getBrowserFeatureSupport } from "./getBrowserFeatureSupport";
import { getBrowserType } from "./browserType";
import { getColorDepth } from "./colorDepth";
import { getColorGamut } from "./colorGamut";
import { getDeviceType, isMobile } from "./deviceType";
import { getFeaturePolicies } from "./featurePolicies";
import { canPlay } from "./mediaSupport";
import { getNavigatorProperties } from "./navigator";
import { getPlatform } from "./platform";
import { getTimeZone } from "./timezone";
import { getUserAgent } from "./userAgent";
import { getVendor } from "./vendor";
import { checkWebPSupport } from "./webpSupport";
import { getBarVisibility } from "./barVisibility";
import { getAvailableFonts } from "./fonts";
import { getHardwareConcurrency } from "./hardwareConcurrency";

export {
    canPlay,
    checkWebPSupport,
    getBrowserType,
    getBrowserFeatureSupport,
    getColorDepth,
    getColorGamut,
    getDeviceType,
    getFeaturePolicies,
    getNavigatorProperties,
    getPlatform,
    getUserAgent,
    getVendor,
    getTimeZone,
    isMobile,
    getBarVisibility,
    getAvailableFonts,
    getHardwareConcurrency
}