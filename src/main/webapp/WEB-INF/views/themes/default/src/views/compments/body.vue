<template>
    <el-row type="flex" justify="center">
        <el-col :span="col">
            <slot></slot>
        </el-col>
    </el-row>
</template>
<style>
</style>
<script>
    export default{
        name: 'sg-body',
        props: {
            col: {
                type: Number,
                default: 20
            }
        }
    }
</script>
