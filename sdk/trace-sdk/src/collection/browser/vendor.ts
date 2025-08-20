import { WindowChecker, NavigatorChecker } from "../../helpers/propertyChecker";

export const getVendor = (): any => {
    if(WindowChecker() && NavigatorChecker()) {
        return window?.navigator?.vendor;
    }
}