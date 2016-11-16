<template>
    <el-menu-item :index="menu.abbr" v-if="menu.children.length == 0">{{menu.name}}</el-menu-item>
    <el-submenu :index="menu.abbr" v-else>
        <template slot="title">{{menu.name}}</template>
        <sg-menu :menu="menuchild" v-for="menuchild in menu.children"></sg-menu>
    </el-submenu>
</template>

<script>
    export default {
        name: "sg-menu",
        props: {
            menu: {
                type: Object
            }
        }
    }
</script>