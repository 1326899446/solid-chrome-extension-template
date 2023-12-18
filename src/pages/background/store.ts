
const local_vars: { [key: string]: { read: boolean, write: boolean, value: string } } = {}

const memory_vars: { [key: string]: string } = {}

export const store = {
    local: {
        get(key: string) {
            const item = local_vars[key]
            return item.read ? item.value : ''
        },
        set(key: string, value: any) {
            const item = local_vars[key]
            item.write && (item.value = value)
        }
    },
    memory: {
        get(key: string) {
            return memory_vars[key] || ''
        },
        set(key: string, value: any) {
            memory_vars[key] = value
        }
    },
    file: {
        read(key: string) {
            return new Promise((resolve) => {
                chrome.storage.local.get(/* String or Array */[key], function (items) {
                    resolve({ key: items[key] })
                });
            })
        },
        write(key: string, content: string) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: content }, function () {
                    resolve({ key, content })
                });
            })
        }
    },
}
