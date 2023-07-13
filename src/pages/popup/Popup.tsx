import "@src/styles/index.css";
import styles from "./Popup.module.css";

chrome.runtime.sendMessage({ action: "get", params: ["active"] }, (response) => {
  console.log(response);
});

const Popup = () => {
  return (
    <div class={styles.App}>
      <div class={styles.ActiveToggle}></div>
    </div>
  );
};

export default Popup;
