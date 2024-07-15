
import { IconArrowUp } from '../components/Icon.js';
import type { Change, Update } from '../types.js';
import { dayjs, useStore } from '../util/index.js';

type ChangeType = 'Additions' | 'Removals' | 'Promotions' | 'Demotions';

const symbolForType = {
    Additions: <IconArrowUp className='size-5 shrink-0 rotate-45' />,
    Removals: <IconArrowUp className='size-5 shrink-0 rotate-[135deg]' />,
    Promotions: <IconArrowUp className='size-5 shrink-0' />,
    Demotions: <IconArrowUp className='size-5 shrink-0 rotate-180' />,
};

function changeText(change: Change) {
    if (!change.nextTier) {
        return `removed from the guide`;
    }
    if (!change.prevTier) {
        return `added as tier ${change.nextTier}`;
    }
    return `moved from tier ${change.prevTier} to tier ${change.nextTier}`;
}

const Change = ({ change, type }: { change: Change, type: ChangeType }) => {
    return (
        <div className='flex items-center gap-2'>
            {symbolForType[type]}
            <div className='flex flex-col leading-none'>
                <span className='text-base'>{change.name}</span>
                <span className='text-secondary text-sm tracking-tighter'>
                    {changeText(change)}
                </span>
            </div>

        </div>
    );
};

const ChangeList = ({ changes, type }: { changes: Change[], type: ChangeType }) => {
    return (
        <div className='mt-4 flex flex-col gap-4 first:mt-0'>
            <h3 className='text-xl font-medium tracking-tighter sm:text-2xl'>{type}</h3>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(12rem,_1fr))]'>
                {changes.map((change, index) => <Change key={index} change={change} type={type} />)}
            </div>

        </div>
    );
};

const Changes = ({ update }: { update: Update }) => {
    return (
        <div className='flex flex-1 flex-col gap-4'>
            {update.promotions && update.promotions.length > 0 ? <ChangeList changes={update.promotions} type='Promotions' /> : null}
            {update.demotions && update.demotions.length > 0 ? <ChangeList changes={update.demotions} type='Demotions' /> : null}
            {update.additions && update.additions.length > 0 ? <ChangeList changes={update.additions} type='Additions' /> : null}
            {update.removals && update.removals.length > 0 ? <ChangeList changes={update.removals} type='Removals' /> : null}
        </div>
    );
};

const Header = ({ update }: { update: Update }) => {
    return (
        <div className='flex flex-col self-start sm:sticky sm:top-4 sm:w-32'>
            <h2 className='hidden text-2xl font-medium tracking-tighter sm:block'>{update.date.getFullYear()}</h2>
            <span className='text-secondary hidden text-sm sm:block'>{dayjs(update.date).format('MMM Do')}</span>
            <h3 className='mb-4 text-2xl font-medium tracking-tighter sm:hidden'>{dayjs(update.date).format('MMM Do, YYYY')}</h3>
        </div>
    );
};

const Update = ({ update }: { update: Update }) => {
    return (
        <div className='border-primary flex flex-col items-stretch border-b py-8 first:pt-0 last:border-0 sm:flex-row'>
            <Header update={update} />
            <Changes update={update} />
        </div>
    );
};

export const Updates = () => {
    const [updates] = useStore(state => [state.updateList]);

    return (
        <main className='flex grow flex-col py-12'>
            <h1 className='mb-9 text-left text-2xl font-medium tracking-tighter'>Tier updates</h1>
            <div className='relative flex flex-col'>
                {updates.map((update, index) => <Update key={index} update={update} />)}
            </div>
        </main>
    );
};