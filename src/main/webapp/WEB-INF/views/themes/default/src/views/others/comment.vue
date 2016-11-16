<template>
    <el-row>
        <el-col :span="24">
            {{content}}
        </el-col>
    </el-row>
</template>
<style>
</style>
<script>
    export default{
        name: 'sg-comment',
        props: {
            content: {
                type: String,
                default: ""
            }
        }
    }
</script>
