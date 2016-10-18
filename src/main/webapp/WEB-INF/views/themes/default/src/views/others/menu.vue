<template>
    <el-menu-item :index="menu.abbr" v-if="menu.children.length == 0">{{menu.name}}</el-menu-item>
    <sg-subMenu :menu="menu" v-else>
        <slot>
            <sg-menu :menu="menuchild" v-for="menuchild in menu.children"></sg-menu>
        </slot>
    </sg-subMenu>
</template>

<script>
    import sgsubmenu from './subMenu.vue';

    export default {
        name: "sg-menu",
        props: {
            menu: {
                type: Object
            }
        },
        components: {
            'sg-subMenu': sgsubmenu
        }
    }
</script>