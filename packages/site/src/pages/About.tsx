export const About = () => {
    return (
        <main className='flex max-w-[70ch] grow flex-col py-12'>
            <h1 className='mb-4 text-left text-2xl font-medium tracking-tighter'>About this guide</h1>
            <p className='my-5'>The media reliability guide, previously known as the transfer reliability guide, is a community driven project that ranks media outlets and journalists in terms of their reliability.</p>
            <p className='my-5'>It's purpose is to provide an overview of the reliability (trustworthiness) of news sources that cover FC Barcelona and help users identify the most reliable sources in order to avoid clickbait, agenda-driven journalism and misinformation.</p>
            <p className='my-5'>Reliability is separated into five levels (called tiers) from 1 as the most reliable to 5 as the least reliable, and additional category for aggregators. Aggregators are sources that don't produce news stories themselves, but instead collect, translate and report on news from other sources. Aggregators are currently not rated for reliability.</p>
            <p className='my-5'>The guide is maintained by the r/barca community and all tiers are voted upon and decided by it's members. Update threads are organized at last once a year, usually before or after a transfer window.</p>
        </main>
    );
};