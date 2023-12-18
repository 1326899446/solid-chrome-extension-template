// import "../../modules/action/index";
// import "../../modules/data/index";
// import "../../modules/network/index";

import { functions } from './functions';

const supported_types = [
    'action',
    'reqxml',
    'reqlocal',
    'reqsofttodo',
    'reqreadmap',
    'reqsavemap',
    'reqreadfile',
    'reqsavefile'
] as const

type SupportedType = typeof supported_types[number];


/**
 * 插件启动之后，会自动执行这个文件
 * 监听并回复来自bridge-script的消息
 */
chrome.runtime.onMessageExternal.addListener(
    async ({ type, payload }: { type: SupportedType, payload: Record<string, string> }, sender, sendResponse) => {
        console.log('background received message', type, payload);
        const result = functions[type](payload);
        // globalState.handleActionRemote?.(message, sender, sendResponse, globalState);
    }
);
