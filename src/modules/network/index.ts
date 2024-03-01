import { initNetowrk } from './init';

initNetowrk()

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.log(details);
        
        return {
            redirectUrl: chrome.runtime.getURL('index.html')
        }
    },
    {
        urls: [
            'https://*'
        ]
    },
    ['blocking']
);