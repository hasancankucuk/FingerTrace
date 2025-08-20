import { NavigatorChecker } from "../../helpers";

export const getNavigatorProperties = (): string[] | null => {
    if(NavigatorChecker()) {
        const navProperties: string[] = [];
        for(var item in window.navigator) {
            navProperties.push(item);
        }

        return navProperties?.sort();
    }

    return null;
}