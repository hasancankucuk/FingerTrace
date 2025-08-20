import { BrowserType } from "../../models";
import { getBrowserType } from "./browserType";

export const getFeaturePolicies = (): string[] | null => {
    const browserType = getBrowserType();

    if (browserType === BrowserType.CHROME || browserType === BrowserType.EDGE || browserType === BrowserType.IE) {
        if ("featurePolicy" in document) {
            const doc = document as Document & { featurePolicy: { features: () => string[] } };
            const features = doc.featurePolicy.features();
            return features.sort();
        }
    }

    return null;
};
