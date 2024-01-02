// store.js
import { IModule } from '@/features/modules/types/IModule';
import {StateCreator, create} from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
    modules: IModule[] | undefined;
    accessModules: IModule[] | undefined;
    setModules: (modules: IModule[]) => void;
    setAccessModules: (modulesIds: number[]) => void;
}
const useModulesStore = create<StoreState>(persist((set, get) => ({
    modules: undefined,
    setModules: (modules: IModule[]) => set({modules}),
    accessModules: undefined,
    setAccessModules: (modulesIds: number[]) => {
        // colocar primero el modulo con code ADMIN si es que existe
        // luego el modulo con code COMM si es que existe
        // luego los demas modulos

        const adminModule = modulesIds.find((id) => {
            const module = get().modules?.find((module) => module.id === id);
            return module?.code === 'ADMIN';
        }
        );

        const commModule = modulesIds.find((id) => {
            const module = get().modules?.find((module) => module.id === id);
            return module?.code === 'COMM';
        }
        );
        
        if (commModule) {
            modulesIds = modulesIds.filter((id) => id !== commModule);
            modulesIds.unshift(commModule);
        }

        if (adminModule) {
            modulesIds = modulesIds.filter((id) => id !== adminModule);
            modulesIds.unshift(adminModule);
        }


        const accessModules = modulesIds.map((id) => {
            const module = get().modules?.find((module) => module.id === id);
            return module;
        }
        ).filter((module) => module !== undefined) as IModule[];

        set({accessModules});

    },
}), {name: 'modules'}) as StateCreator<StoreState>);



export default useModulesStore;
