import { useStore } from '../util/index.js';
import { PhMoonStarsBold, PhSunBold } from './Icon.js';

export const ThemeToggle = () => {
    const [theme] = useStore(state => [state.theme]);
    const [toggleTheme] = useStore(state => [state.toggleTheme]);

    return (
        <div className='border-l border-gray-200 pl-4 dark:border-neutral-700'>
            <button
                aria-label='Toggle between light and dark mode'
                aria-pressed={theme === 'dark'}
                className='theme-toggle'
                onClick={toggleTheme}
            >
                <PhSunBold />
                <PhMoonStarsBold />
            </button>
        </div>
    );
};