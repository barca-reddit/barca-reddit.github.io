import { Footer, Nav } from './components/index.js';
import { About, Sources, Tiers, Updates } from './pages/index.js';
import { useNavigation, useStore } from './util/index.js';

export const App = () => {
    useNavigation();
    const [page] = useStore(state => [state.page]);

    const currentPage = () => {
        switch (page) {
            case 'sources': return <Sources />;
            case 'tiers': return <Tiers />;
            case 'about': return <About />;
            case 'updates': return <Updates />;
            default: return <Sources />;
        }
    };

    return (
        <div className='mx-auto flex min-h-screen max-w-screen-lg flex-col items-stretch justify-start px-4 font-rubik text-[16px]'>
            <Nav />
            {currentPage()}
            <Footer />
        </div>
    );
};
