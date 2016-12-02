<template>
    <sg-body>
        <slot>
            <el-row type="flex" justify="center">
                <el-col :span="23" :offset="1">
                    <el-row>
                        <el-col :span="24">
                            <table class="userInfoTable">
                                <tr>
                                    <td rowspan="4" class="imgTd"><img :src="getAvatar(user.img)"></td>
                                    <td width="200px">登录名:{{user.name}}</td>
                                    <td width="300px" rowspan="4" class="signTd">
                                        <p>{{user.sign}}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>昵称:{{user.nick}}</td>
                                </tr>
                                <tr>
                                    <td>邮箱:{{user.mail}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        金币:{{user.balance}}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10px"></td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="sysuserinfo">{{siteName}}的第{{user.id}}个会员</td>
                                </tr>
                            </table>
                        </el-col>
                        <el-col :span="24">
                            <el-tabs v-loading="tabLoading" :active-name="activeTab" @tab-click="tabClick"
                                     type="border-card" class="userTabs">
                                <el-tab-pane label="主题列表" name="topics">
                                    主题列表
                                </el-tab-pane>
                                <el-tab-pane label="回复列表" name="comments">
                                    回复列表
                                </el-tab-pane>
                                <el-tab-pane label="收藏区域" name="collectArea">
                                    收藏区域
                                </el-tab-pane>
                                <el-tab-pane label="收藏主题" name="collectTopic">
                                    收藏主题
                                </el-tab-pane>
                                <el-tab-pane label="点赞主题主题" name="supportTopic">
                                    点赞主题主题
                                </el-tab-pane>
                                <el-tab-pane label="社会化" name="social">
                                    社会化
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>

                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style scoped>

    .userTabs {
        min-height: 300px;
        width: 100%;
    }

    .userInfoTable {
        width: 100%;
        border-spacing: 0px;
        margin-bottom: 1rem;
    }

    .signTd {
        vertical-align: top;
        background: white;
        border-radius: 0.3em;
    }

    .signTd > p {
        text-align: left;
        padding: 0 1rem;
    }

    .imgTd {
        text-align: center;
        vertical-align: middle;
        width: 60px;
    }

    .sysuserinfo {
        text-align: center;
        font-size: 12px;
        color: grey;
        padding: 4px 0;
        border: 1px dashed grey;
    }
</style>
<script>
    import Body from '../compments/body.vue'
    import {mapActions} from 'vuex'

    export default{
        name: 'userInfo',
        data(){
            return {
                siteName: preLoadData.siteName,
                avatarUrl: preLoadData.userImg,
                id: this.$route.params.id,
                activeTab: 'topics',
                tabLoading: false,
                user: {}
            }
        },
        created(){
            this.getData();
        },
        methods: {
            getData(){
                var that = this;
                this.tabLoading = true;
                this.post({
                    url: '/i/' + that.id
                }).then(function (data) {
                    that.tabLoading = false;
                    if (data.result) {
                        that.user = data.data.user;
                    } else {
                        that.$message.error("获取用户信息失败,请检查网络连接或刷新页面");
                    }
                })
            },
            tabClick(tab, event){
                this.loadArea(tab);
            },
            loadArea(tab){
                switch (tab) {
                    case 'topics': {
                        break;
                    }
                    case '': {

                    }
                }
            },
            getAvatar(img){
                return this.avatarUrl.replace('{md5}', img ? img : '84fe01dba7e12fbae34fd2b7ea3b18a6').replace('s=48', 's=100');
            },
            ...mapActions(["post"])
        },
        components: {
            'sg-body': Body
        }
    }
</script>
