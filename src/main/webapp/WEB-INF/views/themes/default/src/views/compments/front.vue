<template>
    <el-row>
        <el-col :span="24">
            <sg-header :menus="menus"></sg-header>
            <el-row type="flex" justify="center" class="sg-body">
                <el-col :span="col">
                    <slot></slot>
                </el-col>
            </el-row>
            <sg-footer :siteName="siteName" :version="version"></sg-footer>
        </el-col>
    </el-row>

</template>
<style>
    .sg-body {
        margin-top: 10px;
    }

</style>
<script>
    import Header from '../../views/compments/header.vue'
    import Footer from '../../views/compments/footer.vue'

    export default{
        name: 'sg-body',
        props: {
            col: {
                type: Number,
                default: 22
            }
        },
        data () {
            return preLoadData;
        },
        components: {
            'sg-header': Header,
            'sg-footer': Footer
        }
    }
</script>
