import { NavigatorChecker } from "../../helpers";
import { BrowserType } from "../../models";

export const getBrowserType = (): BrowserType => {
    let browser = BrowserType.UNDEFINED
    if(NavigatorChecker()) {
        const userAgent = navigator.userAgent;
        
        // Detect Chrome
        if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
            browser = BrowserType.CHROME
        }
        // Detect Chromium-based Edge
        else if (/Edg/.test(userAgent)) {
            browser = BrowserType.EDGE
        }
        // Detect Firefox
        else if (/Firefox/.test(userAgent)) {
            browser = BrowserType.FIREFOX
        }
        // Detect Safari
        else if (/Safari/.test(userAgent)) {
            browser = BrowserType.SAFARI
        }
        // Detect Internet Explorer
        else if (/Trident/.test(userAgent)) {
            browser = BrowserType.IE
        }
    }

    return browser;
}
