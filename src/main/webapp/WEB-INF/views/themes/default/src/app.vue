<style>
    [v-cloak] {
        display: none;
    }
</style>
<template>
    <el-row>
        <el-col :span="24">
            <sg-header :menus="menus"></sg-header>
            <router-view  v-loading="load" element-loading-text="拼命加载中"></router-view>
            <sg-footer :siteName="siteName" :version="version"></sg-footer>
        </el-col>
    </el-row>
</template>

<script>
    import Header from './views/compments/header.vue'
    import Footer from './views/compments/footer.vue'
    import 'element-ui/lib/theme-default/index.css';
    import {mapState} from 'vuex'

    export default {
        name: 'app',
        data () {
            return preLoadData;
        },
        computed: mapState({
            load: state => state.route.load
        }),
        created () {
        },
        components: {
            'sg-header': Header,
            'sg-footer': Footer
        }
    }
</script>