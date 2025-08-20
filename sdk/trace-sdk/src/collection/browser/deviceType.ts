import { WindowChecker, NavigatorChecker } from "../../helpers/propertyChecker";

const getDeviceType = (): any => {
    if (WindowChecker() && NavigatorChecker()) {
        return window?.navigator?.maxTouchPoints;
    }
}

const isMobile = (): any => {
    if (WindowChecker() && NavigatorChecker()) {
        return window?.navigator?.maxTouchPoints > 0;
    }
}

export {
    getDeviceType,
    isMobile
}