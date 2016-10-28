<template>
    <el-pagination
            @sizechange="handleSizeChange"
            @currentchange="handleCurrentChange"
            :current-page="pageNow"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="pageTotal">
    </el-pagination>
</template>
<style scoped>
    .el-pagination {
        background-color: #f2f3f5;
    }
</style>
<script>

    export default{
        name: 'sg-pager',
        props: {
            pageSize: {
                type: Number,
                default: 30
            },
            pageNow: {
                type: Number,
                default: 1
            },
            pageTotal: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleSizeChange(internalCurrentPage){
                this.$emit('sizechange', internalCurrentPage);
            },
            handleCurrentChange(internalCurrentPage){
                this.$emit('currentchange', internalCurrentPage);
            }
        }
    }
</script>
