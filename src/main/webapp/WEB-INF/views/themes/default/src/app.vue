<style>
    [v-cloak] {
        display: none;
    }
</style>
<template>
    <el-row>
        <el-col :span="24">
            <sg-header :menus="menus"></sg-header>
            <router-view></router-view>
            <sg-footer :siteName="siteName" :version="version"></sg-footer>
        </el-col>
    </el-row>
</template>

<script>
    import Header from './views/compments/header.vue'
    import Footer from './views/compments/footer.vue'

    export default {
        name: 'app',
        data () {
            return preLoadData;
        },
        created () {
            console.log("created")
        },
        components: {
            'sg-header': Header,
            'sg-footer': Footer
        }
    }
</script>