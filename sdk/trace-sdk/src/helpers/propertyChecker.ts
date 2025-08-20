// const root = typeof window !== 'undefined' ? window : global;
const WindowChecker = (): boolean => {
    return !!window;
}

const NavigatorChecker = ():boolean => {
    return !!window?.navigator;
}

const DocumentChecker = ():boolean => {
    return !!document
}

const ScreenChecker = (): boolean => {
    return !!window?.screen
} 

export {
    WindowChecker,
    NavigatorChecker,
    DocumentChecker,
    ScreenChecker
}