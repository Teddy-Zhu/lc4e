<template>
    <el-row>
        <el-col :span="24" class="menu-panel">
            <el-menu default-active="/" theme="dark" :mode="mode" :router="true"
                     class="sg-header" :class="{ fixed : 'fixed' }">
                <template v-for="menu in menus">
                    <el-menu-item :index="menu.abbr" v-if="menu.children.length == 0">{{menu.name}}</el-menu-item>
                    <el-submenu :index="menu.abbr" v-else>
                        <template slot="title">{{menu.name}}</template>
                        <sg-menu :menu="menuchild" v-for="menuchild in menu.children"></sg-menu>
                    </el-submenu>
                </template>
                <template v-if="!user.id">
                    <el-menu-item index="/u/login" class="menu-right">登陆</el-menu-item>
                    <el-menu-item index="/u/register" class="menu-right">注册</el-menu-item>
                </template>
                <template v-else>
                    <el-menu-item index="/u/signout" class="menu-right">退出</el-menu-item>
                    <el-menu-item :index="'/i/' + user.id" class="menu-right">{{user.nick}}</el-menu-item>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>
<style>
    .el-menu--horizontal .el-menu-item.menu-right {
        float: right;
    }

    .el-menu-item.is-active {
        border-bottom: 5px solid #20a0ff;
    }

    .menu-panel {
        height: 60px;
    }

    .sg-header {
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .25);
        padding: 0 5rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
    }

    .sg-header.fixed {
        z-index: 1;
        position: fixed;
        background-color: rgba(50, 64, 87, 0.84);
    }

</style>
<script>
    import {on} from 'wind-dom/src/event';
    import sgmenu  from '../others/menu.vue';
    import {mapState} from 'vuex';

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
        computed: mapState({
            user: state => state.user
        }),
        created(){
            var self = this;
            on(window, 'scroll', function (event) {
                self.fixed = window.scrollY > 0;
            })
        },
        methods: {},
        components: {
            'sg-menu': sgmenu
        }
    }
</script>
