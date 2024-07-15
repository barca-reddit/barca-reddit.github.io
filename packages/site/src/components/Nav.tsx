import { useStore, } from '../util/index.js';
import { ThemeToggle } from './Theme.js';

export const Nav = () => {
    const [page] = useStore(state => [state.page]);

    return (
        <nav className='border-primary flex flex-col items-center justify-between gap-4 border-b py-8 md:flex-row'>
            <a
                className='flex cursor-pointer items-center gap-2'
                href='#sources'
            >
                <img
                    alt='FC Barcelona crest'
                    className='size-10'
                    src='img/crest.png'
                />
                <h1 className='text-left text-2xl font-medium tracking-tighter'>
                    r/barca media reliability guide
                </h1>
            </a>
            <div className='flex items-center gap-4'>
                <ul className='text-secondary border-primary flex items-center gap-4 font-medium'>
                    <li className='flex items-center'>
                        <a className={page === 'sources' ? 'text-primary' : ''} href='#sources'>Sources</a>
                    </li>
                    <li className='flex items-center'>
                        <a className={page === 'updates' ? 'text-primary' : ''} href='#updates'>Updates</a>
                    </li>
                    <li className='flex items-center'>
                        <a className={page === 'tiers' ? 'text-primary' : ''} href='#tiers'>Tiers</a>
                    </li>
                    <li className='flex items-center'>
                        <a className={page === 'about' ? 'text-primary' : ''} href='#about'>About</a>
                    </li>
                </ul>
                <ThemeToggle />
            </div>
        </nav>
    );
};