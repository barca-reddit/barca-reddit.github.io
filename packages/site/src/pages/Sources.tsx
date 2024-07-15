import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { PhInfoBold } from '../components/index.js';
import type { Tier, TierData, TierSource } from '../types.js';
import { dayjs, getTierDescription, getTierTitle, getTooltipPosition, useStore } from '../util/index.js';

const TooltipDetails = ({ source }: { source: TierSource }) => {
    return (
        <>
            <div className='border-primary flex items-center gap-2 border-b p-4 pb-2'>
                <PhInfoBold className='size-5' />
                <h3 className='text-left text-xl font-medium tracking-tighter'>
                    {source.name}
                </h3>
                <span className='sr-only' id={`${source.id}-details`}>{`${source.name} details`}</span>
            </div>
            <div className='grid grid-cols-[min-content,1fr] gap-y-3 p-4 leading-none'>
                <span className='text-nowrap text-left '>Type:</span>
                <span className='text-right'>{source.type}</span>

                {source.type !== 'aggregator'
                    ? <>
                        <span className='text-nowrap text-left '>Tier:</span>
                        <span className='text-right'>Tier {source.tier}</span>
                    </>
                    : null}

                {source.organizations && source.organizations.length > 0
                    ? <>
                        <span className='text-nowrap text-left '>Organizations:</span>
                        <div className='flex flex-col gap-2'>
                            {source.organizations.map(org => <span key={org} className='text-right'>{org}</span>)}
                        </div>
                    </>
                    : null}

                {source.handles && source.handles.length > 0
                    ? <>
                        <span className='text-nowrap text-left '>Handle(s):</span>
                        <div className='flex flex-col gap-2'>
                            {source.handles.map(handle => <a key={handle} className='text-right text-sky-500 hover:underline' href={`https://x.com/${handle}`} target='_blank'>@{handle}</a>)}
                        </div>
                    </>
                    : null}

                {source.domains && source.domains.length > 0
                    ? <>
                        <span className='text-nowrap text-left '>Domain(s):</span>
                        <div className='flex flex-col gap-2'>
                            {source.domains.map(domain => <a key={domain} className='text-right text-sky-500 hover:underline' href={`https://${domain}`} target='_blank'>{domain}</a>)}
                        </div>
                    </>
                    : null}

                {source.addedOn
                    ? <>
                        <span className='text-nowrap text-left'>Added On:</span>
                        <span className='text-right'>{dayjs(source.addedOn).format('Do MMM YYYY')}</span>
                    </>
                    : null}

                {source.updatedOn
                    ? <>
                        <span className='text-nowrap text-left'>Updated At:</span>
                        <span className='text-right'>{dayjs(source.updatedOn).format('Do MMM YYYY')}</span>
                    </>
                    : null}
            </div>
        </>
    );
};

const Source = ({ source, containerRef }: { source: TierSource, containerRef: React.RefObject<HTMLDivElement> }) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const toolTipRef = useRef<HTMLDivElement>(null);
    const isHoveringRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [tooltipVisible, setTooltipVisible] = useState(false);

    function onPointerOver(event: React.PointerEvent<HTMLButtonElement>) {
        if (event.pointerType !== 'mouse') {
            return;
        }

        isHoveringRef.current = true;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (isHoveringRef.current) {
                setTooltipVisible(true);
            }
        }, 300);
    }

    function onPointerLeave(event: React.PointerEvent<HTMLButtonElement>) {
        if (event.pointerType !== 'mouse') {
            return;
        }

        isHoveringRef.current = false;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setTooltipVisible(false);
    }

    function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
        setTooltipVisible(true);
    }

    function onFocus() {
        setTooltipVisible(true);
    }

    /**
     * @see https://blog.saeloun.com/2021/05/14/react-17-uses-browse-focusin-focusout-for-onFocus-onBlur/
     */
    function onBlur(event: React.FocusEvent<HTMLButtonElement, Element>) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setTooltipVisible(false);
        }
    }

    useEffect(() => {
        if (!tooltipVisible || !containerRef.current || !itemRef.current || !toolTipRef.current) {
            return;
        }

        const { top, left } = getTooltipPosition(containerRef.current, itemRef.current, toolTipRef.current);

        toolTipRef.current.style.top = top;
        toolTipRef.current.style.left = left;
    }, [tooltipVisible, containerRef]);

    useEffect(() => {
        const handleClickOutside = (event: PointerEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
                setTooltipVisible(false); // Hide the tooltip
            }
        };

        document.addEventListener('pointerup', handleClickOutside);
        document.addEventListener('pointercancel', handleClickOutside);

        return () => {
            document.removeEventListener('pointerup', handleClickOutside);
            document.removeEventListener('pointercancel', handleClickOutside);
        };
    }, []);

    return (
        <button
            ref={itemRef}
            className={clsx(
                'group relative flex cursor-pointer items-center rounded text-right text-sm',
                source.type !== 'journalist' && 'bg-button border-button rounded border px-2 py-1 leading-none',
            )}
            onBlur={onBlur}
            onFocus={onFocus}
            onPointerLeave={onPointerLeave}
            onPointerOver={onPointerOver}
            onPointerUp={onPointerUp}
        >
            <span className='decoration-2 group-hover:underline'>{source.name}</span>
            {source.organizations && source.organizations.length > 0
                ? <span className='text-light ml-1 text-xs font-medium'>({source.organizations[0]})</span>
                : null}


            {
                /**
                 * Position the tooltip to the left (-left-72) initially to prevent
                 * scroll y shifting before the actual position is calculated.
                 */
            }
            <div
                ref={toolTipRef}
                aria-hidden={!tooltipVisible}
                aria-labelledby={`${source.id}-details`}
                className='bg-primary border-primary absolute -left-72 z-10 w-72 animate-fade-in flex-col rounded-lg border shadow shadow-gray-200 motion-reduce:animate-none dark:shadow-neutral-800'
                id={source.id}
                role='dialog'
                style={{ display: tooltipVisible ? 'flex' : 'none' }}
            >
                <TooltipDetails source={source} />
            </div>
        </button>
    );
};

const SourceList = ({ data, containerRef }: { data: TierData, containerRef: React.RefObject<HTMLDivElement> }) => {
    return (
        <div className={clsx(
            'flex grow flex-col flex-wrap items-end justify-end sm:flex-row',
            data.type === 'journalist' ? 'gap-4' : 'gap-2',
        )}>
            {data.sources.map(source => <Source key={source.id} containerRef={containerRef} source={source} />)}
        </div>
    );
};

const Tier = ({ tier, containerRef }: { tier: Tier, containerRef: React.RefObject<HTMLDivElement> }) => {
    return (
        <div className='border-primary flex items-center border-b py-8 last:border-0'>
            <div className='sticky top-4 flex flex-1 flex-col self-start sm:static sm:top-0'>
                <h2 className='text-2xl font-medium tracking-tighter'>{getTierTitle(tier.tier)}</h2>
                <span className='text-secondary text-sm'>{getTierDescription(tier.tier)}</span>
            </div>
            <div className='flex flex-[3] flex-col flex-wrap items-stretch justify-center gap-8 sm:flex-row'>
                {tier.data.map(data => <SourceList key={data.type} containerRef={containerRef} data={data} />)}
            </div>
        </div>
    );
};

export const Sources = () => {
    // prop drilling :(
    const containerRef = useRef<HTMLDivElement>(null);
    const [tierList] = useStore(state => [state.tierList]);

    return (
        <main ref={containerRef} className='flex grow flex-col py-4'>
            {tierList.map(tier => <Tier key={tier.tier} containerRef={containerRef} tier={tier} />)}
        </main>
    );
};