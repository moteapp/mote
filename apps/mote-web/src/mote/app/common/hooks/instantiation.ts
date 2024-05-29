import { useEffect, useState } from 'react';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';

let _instantiationService: IInstantiationService;

export let mountInstantiationService = (instantiationService: IInstantiationService) => {
    _instantiationService = instantiationService;
}

export function useInstaService() {
    const [instantiationService, setInstantiationService] = useState<IInstantiationService>(_instantiationService);

    useEffect(() => {
        setInstantiationService(_instantiationService);
    }, []);

    return instantiationService;
}