export const getDeviceMemory = () => {
    if(navigator?.deviceMemory) {
        return navigator?.deviceMemory;
    }
    return undefined;
}