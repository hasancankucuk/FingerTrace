import { ScreenChecker } from "../../helpers";

export const getScreenFeatures = (): object | null => {
    if(ScreenChecker() && 'availTop' in screen && 'availLeft' in screen) {
        return {
            ScreenHeight: screen.height ?? '',
            ScreenAvailWidth: screen.availWidth ?? '',
            ScreenAvailTop: screen.availTop ?? '',
            ScreenAvailLeft: screen.availLeft ?? ''
        }
    }
    return null;
} 