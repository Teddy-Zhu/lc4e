<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="15">
                    <el-row>
                        <el-col :span="24">
                            <table>
                                <tr>
                                    <td>{{topic.name}}</td>
                                    <td>{{topic.title}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <img :src="'/images/avatar'+topic.imgUrl">
                                    </td>
                                    <td>
                                        <sg-common :content="topic.body"></sg-common>
                                    </td>
                                </tr>
                            </table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <table v-for="comment in comments" class="comment">
                                <tr>
                                    <td>
                                        <img :src="'/images/avatar'+ comment.imgUrl">
                                    </td>
                                    <td>
                                        <sg-common :content="comment.body"></sg-common>
                                    </td>
                                </tr>
                            </table>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-col :span="24" class="pager-center">
                            <sg-pager :pageNow="page" :pageSize="size" :pageTotal="total"
                                      @currentchange="pageChange" class="inline-block"></sg-pager>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="7" :offset="1">
                    right
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>

</style>
<script>
    import Body from './compments/body.vue'
    import Pager from './others/pager.vue'
    import Comment from './others/comment.vue'

    export default{
        data(){
            return {
                page: 1,
                size: 20,
                total: 0,
                topic: {},
                comments: []
            }
        },
        created(){

        },
        components: {
            'sg-body': Body,
            'sg-pager': Pager,
            'sg-comment': Comment
        }
    }
</script>
