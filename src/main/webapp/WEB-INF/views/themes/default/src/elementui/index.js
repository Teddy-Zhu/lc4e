/**
 * Created by teddyzhu on 2016/12/14.
 */

import {
    Pagination,
    Dialog,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Switch,
    Message,
    Notification,
    MessageBox,
    Select,
    Option,
    Button,
    DatePicker,
    Breadcrumb,
    BreadcrumbItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Icon,
    Row,
    Col,
    Tag,
    Alert,
    Badge,
    Loading
} from 'element-ui';

const install = function (Vue, opts = {}) {
    /* istanbul ignore if */
    if (install.installed) return;

    Vue.component(Pagination.name, Pagination);
    Vue.component(Dialog.name, Dialog);
    Vue.component(Menu.name, Menu);
    Vue.component(Submenu.name, Submenu);
    Vue.component(MenuItem.name, MenuItem);
    Vue.component(Input.name, Input);
    Vue.component(Switch.name, Switch);
    Vue.component(Select.name, Select);
    Vue.component(Option.name, Option);
    Vue.component(Button.name, Button);
    Vue.component(DatePicker.name, DatePicker);
    Vue.component(Breadcrumb.name, Breadcrumb);
    Vue.component(BreadcrumbItem.name, BreadcrumbItem);
    Vue.component(Form.name, Form);
    Vue.component(FormItem.name, FormItem);
    Vue.component(Tabs.name, Tabs);
    Vue.component(TabPane.name, TabPane);
    Vue.component(Tag.name, Tag);
    Vue.component(Alert.name, Alert);
    Vue.component(Icon.name, Icon);
    Vue.component(Row.name, Row);
    Vue.component(Col.name, Col);
    Vue.component(Badge.name, Badge);

    Vue.use(Loading.directive);

    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$msgbox = this.MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = this.Message;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
;

export  default {
    install,
    Loading,
    Pagination,
    Dialog,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Switch,
    Select,
    Option,
    Button,
    DatePicker,
    Breadcrumb,
    BreadcrumbItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Tag,
    Alert,
    Notification,
    Icon,
    Row,
    Col,
    MessageBox,
    Message,
    Badge
}