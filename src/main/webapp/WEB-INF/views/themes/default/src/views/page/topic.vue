<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="15">
                    <el-row>
                        <el-col :span="24">
                            <table class="topic">
                                <tr>
                                    <td>{{topic.authorNick}}</td>
                                    <td class="title">{{topic.title}}</td>
                                </tr>
                                <tr>
                                    <td class="authorpic">
                                        <img :src="getAvatar(topic.authorMail)">
                                    </td>
                                    <td>
                                        <sg-markdown :sourceOut="topic.content" :isEditor="false"></sg-markdown>
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
                                        <sg-markdown :sourceOut="topic.content" :isEditor="false"></sg-markdown>
                                    </td>
                                </tr>
                            </table>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-col :span="24" class="pager-center">
                            <el-pagination
                                    class="inline-block"
                                    @current-change="pageChange"
                                    :current-page="page"
                                    :page-size="size"
                                    layout="prev, pager, next, jumper"
                                    :total="total">
                            </el-pagination>
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
    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .inline-block {
        display: inline-block;
    }

    .topic .title {
        border-bottom: 1px solid black;
        font-size: 1.5em;
    }

    .topic .authorpic {
        vertical-align: top;
    }

</style>
<script>
    import Body from '../compments/body.vue'
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
                    authorName: '',
                    content: '',
                    title: ''
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
                return this.avatarUrl.replace('{md5}', md5(mail)).replace('s=48', 's=66');
            },
            getData(){
                var url = '/t/' + this.name;
                var that = this;
                this.$store.state.route.load = true;
                this.$http.post(url).then(function (response) {
                    that.$store.state.route.load = false;
                    if (response.data.result) {
                        this.topic = response.data.data.topic
                    } else {
                        this.$message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + "..." : response.data.message);
                    }
                }, function (response) {
                    this.$message.error('数据获取错误');
                })
                ;
            },
            updateBaseData(){
                this.name = this.$route.params.topic;
                this.page = this.$route.params.page ? this.$route.params.page : 1;
            }
        },
        components: {
            'sg-body': Body,
            'sg-markdown': (resolve, reject)=> {
                require(['../compments/markdown.vue'], resolve);
            }
        }
    }
</script>
