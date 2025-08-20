import { NavigatorChecker, WindowChecker } from "../../helpers/index";


export const getUserAgent = (): any => {
    if(WindowChecker() && NavigatorChecker() ) {
        return window?.navigator?.userAgent;
    }
}