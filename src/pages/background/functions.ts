import { exec_action } from './actions'
import { store } from './store'

function memory_function(rw: 'read' | 'write') {
    return function (payload: { [key: string]: string }) {
        if (rw === 'read') {
            return Object.fromEntries(Object.entries(payload).map(([key]) => [key.toUpperCase(), store.memory[rw].get(key)])
            ) as { [key in Uppercase<string>]: string }
        } else {
            Object.entries(payload).forEach(([key, value]) => {
                store.memory[rw].set(key, value)
            })
        }
    }
}

function file_function(rw: 'read' | 'write') {
    return function (payload: Record<string, string>) {
        const filename = payload['filename']
        const content = payload['content']
        return store.file[rw](filename, content)
    }
}

export const functions = {
    action(payload: Record<string, string>) {
        const id = payload['id']
        const params = payload['params']
        return exec_action(id, params)
    },

    reqxml(payload: Record<string, string>) {
    },

    reqlocal<T extends string>(payload: { [key in T]: any }) {
        return Object.fromEntries(Object.entries(payload).map(([key]) => [key.toUpperCase(), store.local.get(key)])) as { [key in Uppercase<T>]: string }
    },
    reqsofttodo(payload: Record<string, string>) {
        Object.entries(payload).forEach(([key, value]) => {
            store.local.set(key, value)
        })
    },

    reqreadmap: memory_function('read'),
    reqsavemap: memory_function('write'),

    reqreadfile: file_function('read'),
    reqsavefile: file_function('write'),
} as const