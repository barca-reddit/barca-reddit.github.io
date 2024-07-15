import { useMemo } from 'react';
import { getCurrentPageFromHash, useStore } from './index.js';

export const useNavigation = () => {
    const [setPage] = useStore(state => [state.setPage]);

    useMemo(() => {
        const onHashChange = () => {
            setPage(getCurrentPageFromHash());
        };

        window.addEventListener('hashchange', onHashChange);

        return () => window.removeEventListener('hashchange', onHashChange);
    }, [setPage]);
};