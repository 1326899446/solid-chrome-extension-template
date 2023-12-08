actions = {
    80064:()=>{
        return '1|2|3,2|3|4,3|4|5'
    },
    80000:(params)=>{
        chrome.tabs.create({url:'http://www.baidu.com'});
        console.log(params);
    },
}
