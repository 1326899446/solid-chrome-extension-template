const action_registry = {
    10061:{
        url: 'https://c.zhangle.com/pic/pic/cft/picture/mofang/rc-upload-1702887602894-2action10061.js'
    }
} as {
    [id: string]: {
        url: string,
        func?: (payload: string) => never
    }
}

export async function exec_action(id: string, payload: string) {
    const action = action_registry[id]
    if (!action) {
        return Error('action not found')
    } else if (!action.func) {
        action.func = (await import(action.url)).default
    }

    return action.func(payload)
}

