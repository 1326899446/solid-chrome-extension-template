import { render } from "solid-js/web";
import App from "./components/Demo/app";

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);
// content 和 页面结构共享DOM，但不共享js，也就是说两者的window是不同的
render(App, root);
