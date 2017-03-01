<style>
    [v-cloak] {
        display: none;
    }
</style>
<template>
    <router-view v-loading="load" element-loading-text="拼命加载中"></router-view>
</template>

<script>

    import 'element-ui/lib/theme-default/index.css';
    import './common/base.css';

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
        }
    }
</script>