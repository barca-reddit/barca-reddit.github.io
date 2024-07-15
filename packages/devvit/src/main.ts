import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
    label: 'Testing',
    location: 'subreddit',
    onPress(event, context) {
        console.log(event);
        console.log(context);
    },
});

export default Devvit;