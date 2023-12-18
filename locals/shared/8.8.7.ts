const locals: { [key: string]: { read: boolean, write: boolean , value: string } } = {
    'upversion': {
        read: true,
        write: false,
        value: '8.8.7'
    },
    'uniqueId': {
        read: true,
        write: false,
        get value(){
            const uniqueId = localStorage.getItem('uniqueId')
            if(!uniqueId){
                const newUniqueId = Math.random().toString(36).slice(2)
                localStorage.setItem('uniqueId', newUniqueId)
                return newUniqueId
            }
            return uniqueId
        }
    }, 
} 