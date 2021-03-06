import Vue from 'vue'
import { Button, Form, FormItem, Input, Container,Header,Aside,Main } from 'element-ui'
import {Message,
Menu,
Submenu,
MenuItem,
Breadcrumb,
BreadcrumbItem,
Card, Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,
MessageBox , Tag, Tree, Select,Option,Cascader
} from "element-ui"
import ZkTable from 'vue-table-with-tree-grid'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm=MessageBox.confirm
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.component('tree-table', ZkTable)
Vue.use(Cascader)