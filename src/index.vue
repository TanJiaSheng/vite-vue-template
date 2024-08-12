<template>
    <div class="magic-input">
        <div
            ref="inputRef"
            id="magic-input-wrap"
            :contenteditable="canEdit"
            class="magic-input-wrap"
            @input="onChange">
        </div>
        <div ref="reference" :style="{
            height: '200px',
             background: '#fff',
             width: popoverWidth
        }">
        <ul style="color: darkblue; list-style: none;">
            <li v-for="option in options" :key="option" @click="handleSelect(option)">{{ option }}</li>
        </ul>
    </div>
    <div @click="handleSelect('sss')">ssss</div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, reactive } from 'vue'
    import useState from './hooks'
    import Tippy from 'tippy.js'
    const props = defineProps({
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        }
    })
    const options = ['这是标签1', '这是标签2', '这是标签3']
    const inputRef = ref()
    const popoverWidth = ref('200px')
    const reference = ref()
    const instance = reactive<{
       [key: string]: any
    }>({})
   const [content, setContent] = useState('')
   const currentAtIdx = ref<number>(0)
   const focusNode = ref<Node | string>()
   // 弹框的x,y轴的坐标
   const cursorPosition = reactive<{
    x: number,
    y: number
   }>({
        x: 0,
        y: 0,
    })
   console.log(content)
    onMounted(() => {
        popoverWidth.value = inputRef.value.clientWidth + 'px'
        Object.assign(instance, Tippy(inputRef.value, {
            trigger: 'manual',
            content: reference.value,
            placement: 'bottom-start',
            maxWidth: popoverWidth.value,
            hideOnClick: false,
            allowHTML: true
        }))
    })
    const canEdit = computed(() => !(props.readonly && props.disabled))
    /** 获取选择器弹框坐标 */
    const getCursorPosition = () => {
        // 坐标相对浏览器的坐标
        const { x, y } = window.getSelection()?.getRangeAt(0).getBoundingClientRect() as any;
        // 获取编辑器的坐标
        const editorDom = window.document.querySelector('#magic-input-wrap');
        const { x: eX, y: eY } = editorDom?.getBoundingClientRect() as any;
        // 光标所在位置
        Object.assign(cursorPosition, { x: x - eX, y: y - eY })
    };

    const onObserveInput = () => {
        let cursorBeforeStr = '';
        const selection: any = window.getSelection();
        if (selection?.focusNode?.data) {
            cursorBeforeStr = selection.focusNode?.data.slice(0, selection.focusOffset);
        }
        focusNode.value = selection.focusNode
        const lastAtIndex = cursorBeforeStr?.lastIndexOf('@');
        currentAtIdx.value = lastAtIndex
        if (lastAtIndex !== -1) {
            instance.show()
            // instance.enable()
            // instance.enabled()
            getCursorPosition();
            const searchStr = cursorBeforeStr.slice(lastAtIndex + 1);
            console.log(searchStr)
            // if (!StringTools.isIncludeSpacesOrLineBreak(searchStr)) {
            //     setSearchStr(searchStr);
            //     fetchOptions(searchStr);
            //     setVisible(true);
            // } else {
            //     setVisible(false);
            //     setSearchStr('');
            // }
        } else {
            // setVisible(false);
        }
    }

    function onChange(event: any) {
        const { innerText } = event.target;
        // console.log(innerText)
        setContent(innerText);
        onObserveInput();
    }
    /**
     * @param id 唯一的id 可以uid
     * @param name 用户姓名
     * @param color 回显颜色
     * @returns
     */
     const createAtSpanTag = (id: number | string, name: string, color = 'blue') => {
        const ele = document.createElement('span');
        ele.className = 'at-span';
        ele.style.color = color;
        ele.id = id.toString();
        ele.contentEditable = 'false';
        ele.innerText = `@${name}`;
        return ele;
    };
    function handleSelect(item: string) {
        console.log(item)
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0) as Range;
        // 选中输入的 @关键字  -> @郑
        range.setStart(focusNode as unknown as Node, currentAtIdx.value);
        range.setEnd(focusNode as unknown as Node, currentAtIdx.value + 1);
        // 删除输入的 @关键字
        range.deleteContents();
        // 创建元素节点
        const atEle = createAtSpanTag(item, item);
        console.log(atEle)
        // 插入元素节点
        range.insertNode(atEle);
        // 光标移动到末尾
        range.collapse();
        // 缓存已选中的用户
        // setSelected([...selected, item]);
        // 选择用户后重新计算content
        setContent(document.getElementById('magic-input-wrap')?.innerText as string);
        // 关闭弹框
        // setVisible(false);
        // 输入框聚焦
        // atRef.current.focus();
    }
</script>

<style scoped>
    .magic-input {
        .magic-input-wrap {
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #FFF;
            width: 100%;
            height: 200px;
            color: black;
            outline: none !important;
        }
    }
</style>