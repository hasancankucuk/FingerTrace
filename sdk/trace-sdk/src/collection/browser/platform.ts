import { WindowChecker, NavigatorChecker } from "../../helpers/propertyChecker";

export const getPlatform = ():any => {
    if(WindowChecker() && NavigatorChecker()) {
        return window?.navigator?.platform;
    }
}