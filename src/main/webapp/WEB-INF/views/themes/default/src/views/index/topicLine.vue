<template>
    <el-row class="topic-line">
        <el-col :span="3" class="topic-author-pic">
            <a>
                <img :src="data.imageUrl" class="topic-line-img">
            </a>
        </el-col>
        <el-col :span="21" class="topic-line-body">
            <router-link :to="data.articleUrl" tag="div" class="topic-line-title">
                {{data.articleTitle}}
            </router-link>
            <div class="topic-line-meta">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/a/' +data.category }"><el-tag type="primary" class="el-tag-mini">{{data.category}}</el-tag></el-breadcrumb-item>
                    <el-breadcrumb-item><el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-user"></i>{{data.user}}</el-tag></el-breadcrumb-item>
                    <el-breadcrumb-item><el-tag type="gray" class="clickable el-tag-mini"><i class="iconfont icon-huo"></i>{{data.comments}}</el-tag></el-breadcrumb-item>
                    <el-breadcrumb-item><el-tag type="gray" class="clickable el-tag-mini"><i class="el-icon-date"></i>{{data.publishTime}}</el-tag></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-col>
    </el-row>
</template>
<style>
    .el-tag-mini {
        height: 13px;
        line-height: 13px;
    }
    .el-tag.clickable{
        cursor: pointer;
    }
    .topic-line-img {
        width: 3em;
        height: 3em;
    }

    .topic-line {
        padding: .3em 0;
        border-bottom: 1px solid #eaeefb;
    }

    .topic-line:hover {
        background-color: white;
    }

    .topic-line-title {
        cursor: pointer;
        display: inline-block;
        font-size: 1.3em;
        line-height: 1.3em;
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
