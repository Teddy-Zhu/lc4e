<template>
    <el-row type="flex" justify="center">
        <el-col :span="12">
            <slot></slot>
        </el-col>
    </el-row>
</template>
<style>
</style>
<script>

    export default{
        name: 'sg-background',
        props: {},
        data () {
            return {
                siteName: preLoadData.siteName
            };
        },
    }
</script>
