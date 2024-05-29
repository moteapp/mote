import { bundle as moteBundle} from '../../dist/mote.json';

const injectedJs = {
    moteEditorBundle:moteBundle,
};

export const shim = {
    injectedJs: (name) => {
        return injectedJs[name];
    },
};
