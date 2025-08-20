import { WindowChecker } from "../../helpers"

export const getPixelRatio = (): number => {
    if(WindowChecker()) {
        return window.devicePixelRatio;
    }

    return 0;
}