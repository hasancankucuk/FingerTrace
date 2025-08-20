import { WindowChecker } from "../../helpers"

export const getColorDepth = (): number => {
    if(WindowChecker()) {
        return window?.screen?.colorDepth;
    }

    return 0;
}