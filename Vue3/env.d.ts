/// <reference types="vite/client" />
// 这是为了让Vue认识其他类型的文件的，称为声明文件
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
// 解决不认识引入文件的问题