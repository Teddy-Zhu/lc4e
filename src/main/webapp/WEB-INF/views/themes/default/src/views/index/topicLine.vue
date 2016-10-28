<template>
    <el-row class="topic-line">
        <el-col :span="24">
            <table class="topic-table">
                <tr>
                    <td align="center" width="10%">
                        <a class="topic-author-img-a">
                            <img :src="data.imageUrl" class="topic-line-img">
                        </a>
                    </td>
                    <td align="left" width="75%">
                        <router-link :to="data.articleUrl" tag="div" class="topic-line-title">
                            {{data.articleTitle}}
                        </router-link>
                        <div class="topic-line-meta">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item :to="{ path: '/a/' +data.category }">
                                    <el-tag type="primary" class="el-tag-mini"><i class="iconfont icon-area"></i>{{data.category}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <el-tag type="gray" class="clickable el-tag-mini"><i
                                            class="iconfont icon-people"></i>{{data.user}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-cmt"></i>{{data.comments}}
                                    </el-tag>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-time"></i>{{data.publishTime}}
                                    </el-tag>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                    </td>
                    <td align="right">
                        <el-tag type="warning" v-if="label != ''" v-for="label in data.statusText">{{label}}</el-tag>
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
        transition: box-shadow 500ms;
    }

    .topic-line:hover {
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
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
    export default{
        name: 'sg-topic-Line',
        props: {
            data: {
                type: Object
            }
        },
        components: {}
    }
</script>
