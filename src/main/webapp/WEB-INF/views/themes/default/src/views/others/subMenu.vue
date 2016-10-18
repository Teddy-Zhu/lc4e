<template>
    <el-submenu :index="menu.abbr">
        <template slot="title">{{menu.name}}</template>
        <slot></slot>
    </el-submenu>
</template>
<style>
</style>
<script>
    export default{
        name: 'sg-subMenu',
        props: {
            menu: {
                type: Object
            }
        }
    }
</script>
