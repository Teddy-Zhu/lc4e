<template>
    <el-row justify="center">
        <el-col :span="24" class="header back">
            <div>{{siteName}} Control Center</div>
        </el-col>
        <el-col :span="4" class="back menu">
            <sg-back-menu></sg-back-menu>
        </el-col>
        <el-col :span="20">
            <slot></slot>
        </el-col>
    </el-row>
</template>
<style scoped>
    .back.menu {
        background: #eef1f6;
        min-height: 600px;
    }

    .back.header {
        height: 60px;
        color: white;
        background: #2196F3;
        width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        padding: 15px 2em;
        font-size: x-large;
    }
</style>
<script>
    import BackMenu from '../background/menu.vue'

    export default{
        name: 'sg-background',
        props: {},
        data () {
            return {
                siteName: preLoadData.siteName
            };
        },
        components: {
            'sg-back-menu': BackMenu
        }
    }
</script>
