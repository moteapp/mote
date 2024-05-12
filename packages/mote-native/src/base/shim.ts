const injectedJs = {
    moteBundle: require('../../../mote/dist/assets/index-BuZ5MH7f'),
};

type IInjectable = keyof typeof injectedJs;

export const shim = {
    injectedJs: (name: IInjectable) => {
        return injectedJs[name];
    },
};
