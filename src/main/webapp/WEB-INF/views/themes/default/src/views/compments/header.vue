<template>
    <el-row>
        <el-col :span="24" class="menu-panel">
            <el-menu default-active="/" theme="dark" :mode="mode" @select="select"
                     class="sg-header" :class="{ fixed:fixed }">
                <sg-menu :menu="menu" v-for="menu in menus"></sg-menu>
            </el-menu>
        </el-col>
    </el-row>
</template>
<style>
    .menu-panel {
        height: 60px;
    }

    .sg-header {
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .25);
        padding: 0 5rem;
    }

    .sg-header.fixed {
        width: 100%;
        z-index: 1;
        position: fixed;
        background-color: rgba(50, 64, 87, 0.84);
    }

</style>
<script>
    import {on} from 'wind-dom/src/event';
    import sgmenu from '../others/menu.vue';

    export default{
        name: "sg-header",
        data(){
            return {
                fixed: false
            }
        },
        props: {
            mode: {
                type: String,
                default: 'horizontal'
            },
            menus: {
                type: Array,
                required: true
            }
        },
        created(){
            let self = this;
            on(window, 'scroll', function (event) {
                self.fixed = window.scrollY > 0;
            })
        },
        methods: {
            select(index, indexPath){
                if (index)
                    this.$router.push(index);
            }
        },
        components: {
            'sg-menu': sgmenu
        }
    }
</script>
