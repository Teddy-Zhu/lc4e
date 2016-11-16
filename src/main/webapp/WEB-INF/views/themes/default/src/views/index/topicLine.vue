<template>
    <el-row class="topic-line">
        <el-col :span="24">
            <table class="topic-table">
                <tr>
                    <td align="center" width="10%">
                        <a class="topic-author-img-a">
                            <img :src="getAvatar(data.authorMail)" class="topic-line-img">
                        </a>
                    </td>
                    <td align="left" width="75%">
                        <router-link :to="getTopicUrl(data.id)" tag="div" class="topic-line-title">
                            {{data.title}}
                        </router-link>
                        <div class="topic-line-meta">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item :to="{ path: getAreaUrl(data.areaAbbr) }">
                                    <el-tag type="primary" class="el-tag-mini"><i class="iconfont icon-area"></i>{{data.areaAbbr}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item :to="{ path : getUserUrl(data.authorId) }">
                                    <el-tag type="gray" class="clickable el-tag-mini"><i
                                            class="iconfont icon-people"></i>{{data.authorNick}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-cmt"></i>{{data.commentCount}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-time"></i>{{data.createTime}}
                                    </el-tag>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                    </td>
                    <td align="right">
                        <el-tag type="warning" v-for="label in splitText(data.texts)">{{label}}
                        </el-tag>
                    </td>
                </tr>
            </table>
        </el-col>
    </el-row>
</template>
<style>
    .el-tag-mini {
        height: 12px;
        line-height: 12px;
    }

    .topic-author-img-a {
        display: inline-block;
        margin: 0 5px;
    }

    .el-tag.clickable {
        cursor: pointer;
    }

    .topic-line-img {
        width: 3em;
        height: 3em;
    }

    .topic-table {
        width: 100%;
    }

    .topic-line {
        padding: .3em 0;
        border-bottom: 1px solid #c2c8dc;
        border-left: 0 solid black;
        transition: box-shadow 500ms, border-left 70ms;
    }

    .topic-line:hover {
        background-color: white;
        border-left: 5px solid black;
        box-shadow: 2px 4px 6px rgba(29, 26, 26, 0.3)
    }

    .topic-line-title {
        word-break: break-all;
        word-wrap: break-word;
        display: inline-block;
        text-align: left;
        cursor: pointer;
        font-size: 1.1em;
        line-height: 1.1em;
    }

    .topic-line-title:after {
        width: 100%;
        height: 2px;
        background-color: #4183C4;
        content: '';
        -webkit-transition: all 0.2s;
        -webkit-backface-visibility: hidden;
        transition: all 0.2s;
        backface-visibility: hidden;
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        clear: both;
        display: block;
    }

    .topic-line-title:hover:after {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }

    .topic-line-meta {
        margin-top: .2em;
    }

    .topic-line-body {

    }
</style>
<script>
    import md5 from 'md5'

    export default{
        name: 'sg-topic-Line',
        data() {
            return {avatarUrl: preLoadData.userImg}
        },
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            getAreaUrl(id){
                return '/a/' + id;
            },
            getTopicUrl(id){
                return '/t/' + id;
            },
            getUserUrl(id){
                return '/i/' + id;
            },
            getAvatar(mail){
                return this.avatarUrl.replace('{md5}', md5(mail));
            },
            splitText(str){
                if (!str) return [];
                return str.split(',');
            }
        },
        components: {}
    }
</script>
