export const getBarVisibility = (): object => {
    return {
        LocationBar: locationbar?.visible ?? null,
        Menubar: menubar?.visible ?? null,
        Personalbar: personalbar?.visible ?? null,
        Statusbar: statusbar?.visible ?? null,
        Toolbar: toolbar?.visible ?? null
    }
}