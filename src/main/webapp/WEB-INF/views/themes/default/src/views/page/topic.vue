<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="15">
                    <el-row>
                        <el-col :span="24">
                            <table class="topic replyTable">
                                <tr>
                                    <td class="left">{{topic.authorNick}}</td>
                                    <td class="title">{{topic.title}}</td>
                                </tr>
                                <tr>
                                    <td class="authorpic left">
                                        <img :src="getAvatar(topic.authorImg)">
                                    </td>
                                    <td>
                                        <sg-markdown :sourceOut="topic.content" :isEditor="false"></sg-markdown>
                                    </td>
                                </tr>
                            </table>
                        </el-col>
                        <el-col :span="24">
                            <table v-for="comment in comments" class="comment replyTable">
                                <tr>
                                    <td rowspan="2" class="authorpic left">
                                        <img :src="getAvatar(comment.img)">
                                    </td>
                                    <td class="commentTitle">
                                        <el-breadcrumb separator=" ">
                                            <el-breadcrumb-item :to="{ path: '/i/' + comment.userId }">
                                                <el-tag class="clickable">{{comment.nick}}</el-tag>
                                            </el-breadcrumb-item>
                                            <el-breadcrumb-item>
                                                <el-tag type="gray">Reply : {{getDate(comment.createTime)}}</el-tag>
                                            </el-breadcrumb-item>
                                        </el-breadcrumb>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <sg-markdown :sourceOut="comment.content" :isEditor="false"></sg-markdown>
                                    </td>
                                </tr>
                            </table>
                            <div v-if="comments.length == 0" class="emptyComment">
                                no comments
                            </div>
                        </el-col>
                        <el-col :span="24" class="pager-center" v-show="comments.length != 0">
                            <el-pagination
                                    class="inline-block"
                                    @current-change="pageChange"
                                    :current-page="page"
                                    :page-size="size"
                                    layout="prev, pager, next, jumper"
                                    :total="total">
                            </el-pagination>
                        </el-col>
                        <el-col :span="24">
                            <el-form ref="form" :rules="rules" :model="form" label-width="0">
                                <el-form-item label="" prop="content" class="replyItem">
                                    <el-input placeholder="请输入回复内容,文明用语,O(∩_∩)O" type="textarea"
                                              v-model="form.content" class="replyArea"
                                              :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" v-if="captcha" prop="captcha">
                                    <el-input v-model="form.captcha"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">回复</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="24">

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

    .comment {
        width: 100%;
    }

    .topic {
        margin-bottom: 1rem;
    }

    .el-pagination {
        background-color: #f2f3f5;
    }

    .clickable {
        cursor: pointer;
    }

    .replyTable {
        border-spacing: 0px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        border: 1px solid #d3dce6;
        background: white;
        padding: 10px 10px;
        border-radius: 0.3em;
    }

    .comment.replyTable {
        border-radius: 0;
        border-bottom: none;
    }

    .comment.replyTable:first-child {
        border-top-left-radius: 0.3em;
        border-top-right-radius: 0.3em;
    }

    .comment.replyTable:last-child {
        border-bottom: 1px solid #d3dce6;
        border-bottom-right-radius: 0.3em;
        border-bottom-left-radius: 0.3em;
    }

    .comment.replyTable {
        padding: 8px 10px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    }

    .comment .commentTitle {
        border-bottom: 1px dashed black;
        padding-bottom: 5px;
    }

    .inline-block {
        display: inline-block;
    }

    .left {
        width: 80px;
        text-align: center;
    }

    .title {
        border-bottom: 1px dashed black;
        font-size: 1.5em;
    }

    .authorpic {
        vertical-align: top;
    }

    .emptyComment {
        text-align: center;
        background: white;
        width: 100%;
        border-radius: .2em;
        margin-top: 1rem;
        border: 1px dashed #afafaf;
        padding: 1rem 10px;
        box-sizing: border-box;
    }

    .replyArea {
        margin: 1rem 0;
    }

    .replyItem.el-form-item {
        margin-bottom: 0px;
    }
</style>
<script>
    import Body from '../compments/body.vue'
    import {mapActions} from 'vuex'
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
                rules: {
                    content: [
                        {required: true, message: ' ', trigger: 'blur'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                form: {
                    content: '',
                    captcha: ''
                },
                comments: []
            }
        },
        created(){
            this.getData();
            this.getComments();
        },
        watch: {
            $route(val, oldVal){
                this.updateBaseData();
                this.getData();
            },
            page(val, OldVal){
                this.getComments();
            },
        },
        methods: {
            goPath(path){
                console.log("click ");
                this.$router.push(path);
            },
            getComments(){
                var that = this;
                that.post({
                    url: "/t/" + that.name + "/comment/" + that.page,
                }).then(function (data) {
                    if (data.result) {
                        that.comments = data.data.comments.result;
                        that.page = data.data.comments.pageNumber;
                        that.total = data.data.comments.totalCount;
                        that.size = data.data.comments.pageSize;
                    } else {
                        that.$message({
                            message: data.message,
                            type: 'warning'
                        });
                    }
                })
            },
            getDate(d){
                return new Date(d).toLocaleString();
            },
            ...mapActions(["post"]),
            onSubmit(){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.post({
                            url: '/t/' + that.name + "/reply",
                            data: that.form
                        }).then(function (data) {
                            if (data.result) {
                                that.$message({
                                    message: '回复主题' + that.topic.title + '成功',
                                    type: 'success'
                                });
                            } else {
                                that.$message({
                                    message: data.message,
                                    type: 'warning'
                                });
                            }
                        })
                    } else {
                        that.$message({
                            message: '请填写必要信息',
                            type: 'warning'
                        });
                        return false;
                    }
                })
            },
            pageChange(){
                this.page = page;
            },
            getAvatar(img){
                return this.avatarUrl.replace('{md5}', img ? img : '84fe01dba7e12fbae34fd2b7ea3b18a6').replace('s=48', 's=66');
            },
            getData(){
                var url = '/t/' + this.name + "/info";
                var that = this;
                this.$store.state.route.load = true;
                this.$http.post(url).then(function (response) {
                    that.$store.state.route.load = false;
                    if (response.data.result) {
                        this.topic = response.data.data.topic;
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
