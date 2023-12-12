export const importScript = (url:string)=>{
    return fetch(url).then((response) => response.text()).catch((error) => console.error("Error:", error));
}