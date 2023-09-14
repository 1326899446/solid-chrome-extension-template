import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HopeProvider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  createDisclosure,
} from "@hope-ui/solid";
import "@src/styles/index.css";
import { createSignal, onMount } from "solid-js";
import styles from "./Options.module.css";

interface actionProps {
  id: string | number;
  // 最好是个json字符串
  data: string;
}
const Options = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [actionList, setActionList] = createSignal<actionProps[]>([]);
  const [actionNumber,setActionNumber] = createSignal<string>('')
  const [data,setData] = createSignal('')

  onMount(() => {
    chrome.storage.sync.get(["actions"], ({ actions }) => {
      setActionList(actions);
    });
  });
  const handleActionInput  = (e)=>{
    setActionNumber(e.target.value)
  }
  const handleDataInput = (e)=>{
    setData(e.target.value);
  }
  const submit = ()=>{
    setActionList([...actionList(),{
      id:actionNumber(),
      data:data()
    }])
    chrome.storage.sync.set({actions:actionList()})
    onClose()
  }
  return (
    <HopeProvider>
      <div class={styles.optionsPage}>
        <div class={styles.newAction}>
          <Button onClick={onOpen}>新建 Action</Button>
        </div>
        <div class={styles.actionList}>
          <div class={styles.row}>
            <div class={styles.id}>action号</div>
            <div class={styles.data}>数据</div>
          </div>
          {actionList().map((action) => {
            const { id, data } = action;
            return (
              <div class={styles.row}>
                <div class={styles.id}>{id}</div>
                <div class={styles.data}>{data}</div>
              </div>
            );
          })}
        </div>
        <Modal opened={isOpen()} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>新建action</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel for="action">action</FormLabel>
                <Input id="action" value={actionNumber()}
                    onInput={handleActionInput}/>
                <FormHelperText>为五位或四位的数字或数字型字符串</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel for="data">测试数据</FormLabel>
                <Input id="data" value={data()} onInput={handleDataInput}/>
                <FormHelperText>json字符串</FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={submit}>确定</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </HopeProvider>
  );
};

export default Options;
