<template>
    <el-row type="flex" justify="center" class="sg-body">
        <el-col :span="col">
            <slot></slot>
        </el-col>
    </el-row>
</template>
<style>
    .sg-body {
        margin-top: 10px;
    }
</style>
<script>
    export default{
        name: 'sg-body',
        props: {
            col: {
                type: Number,
                default: 22
            }
        }
    }
</script>
