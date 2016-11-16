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
                                        <img :src="getAvatar(topic.authorMail)">
                                    </td>
                                    <td>
                                        <sg-comment :content="topic.content"></sg-comment>
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
                                        <img :src="getAvatar(user.mail)">
                                    </td>
                                    <td>
                                        <sg-comment :content="comment.content"></sg-comment>
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
<style scoped>
    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .inline-block {
        display: inline-block;
    }
</style>
<script>
    import Body from '../compments/body.vue'
    import Pager from '../others/pager.vue'
    import Comment from '../others/comment.vue'
    import md5 from 'md5'

    export default{
        name: "topicInfo",
        data(){
            return {
                avatarUrl: preLoadData.userImg,
                name: this.$route.params.topic,
                page: this.$route.params.page ? this.$route.params.page : 1,
                size: 20,
                total: 0,
                topic: {
                    authorMail: '',
                    name: '',
                    content: ''
                },
                comments: []
            }
        },
        created(){
            this.getData();
        },
        watch: {
            $route(val, oldVal){
                this.updateBaseData();
                this.getData();
            }
        },
        methods: {
            pageChange(){

            },
            getAvatar(mail){
                return this.avatarUrl.replace('{md5}', md5(mail));
            },
            getData(){
                var url = '/t/' + this.name;
                this.$http.post(url).then((response)=> {
                    if (response.data.result) {
                        this.topic = response.data.data.topic
                    } else {
                        this.$message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + "..." : response.data.message);
                    }
                }, (response)=> {
                    this.$message.error('数据获取错误');
                });
            },
            updateBaseData(){
                this.name = this.$route.params.topic;
                this.page = this.$route.params.page ? this.$route.params.page : 1;
            }
        },
        components: {
            'sg-body': Body,
            'sg-pager': Pager,
            'sg-comment': Comment
        }
    }
</script>
