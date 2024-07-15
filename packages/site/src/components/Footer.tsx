import { dayjs, useStore } from '../util/index.js';
import { Fa6BrandsDiscord, Fa6BrandsGithub, Fa6BrandsReddit } from './Icon.js';

export const Footer = () => {
    const [lastUpdate] = useStore(state => [state.lastUpdate]);

    return (
        <footer className='border-primary flex flex-col items-center justify-between gap-4 border-t py-8 sm:flex-row'>
            <div className='flex'>
                <span>Last update on {dayjs(lastUpdate).format('Do MMM, YYYY')}</span>
            </div>
            <ul className='flex items-center gap-2'>
                <li>
                    <a className='flex items-center gap-2' href='https://github.com/barca-reddit/barca-reddit.github.io' target='_blank'>
                        <span>Github</span>
                        <Fa6BrandsGithub className='size-4' />
                    </a>
                </li>
                <li>
                    <a className='flex items-center gap-2' href='https://reddit.com/r/barca' target='_blank'>
                        <span>Reddit</span>
                        <Fa6BrandsReddit className='size-4' />
                    </a>
                </li>
                <li>
                    <a className='flex items-center gap-2' href='https://discord.gg/invite/6GPhE3mE7p' target='_blank'>
                        <span>Discord</span>
                        <Fa6BrandsDiscord className='size-4' />
                    </a>
                </li>
            </ul>
        </footer>
    );
};