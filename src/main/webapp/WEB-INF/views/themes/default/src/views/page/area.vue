<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="15">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="13" class="br-path">
                            <el-breadcrumb separator=">">
                                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item :to="{ path : '/a/' + area }">{{area}}</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-col>
                        <el-col :span="10">
                            <el-row type="flex" justify="end">
                                <el-col :span="11" class="el-col-right">
                                    <el-button type="primary" size="mini" icon="edit" @click="newTopic" v-if="user.id">
                                        发布主题
                                    </el-button>
                                </el-col>
                                <el-col :span="12" :offset="1">
                                    <el-select v-model="orderNow" class="el-select-mini">
                                        <el-option
                                                v-for="orderItem in orders"
                                                :label="orderItem.label"
                                                :key="orderItem.value"
                                                :value="orderItem.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <sg-topic-Line :data="data" v-for="data in topics"></sg-topic-Line>
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
                    <el-row class="topic-hot">
                        <el-col :span="24">
                            <h3>{{area}}</h3>
                        </el-col>
                        <el-col :span="24" class="topic-hot-line">
                            <p>{{areaDescription}}</p>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style type="text/css">

    .topic-hot-line {
        margin: 5px 0;
        border-bottom: 1px solid #c2c8dc;
        padding-left: 5px;
        padding-bottom: 5px;
    }

    .topic-hot-line a {
        display: inline;
    }

    .topic-hot div:first-child h3 {
        text-align: center;
        margin: .4em 0;
    }

    .topic-hot {
        min-height: 100px;
        padding: 10px 0;
        background-color: white;
        margin-bottom: 1rem;
        border-radius: 0.2em;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(162, 162, 162, 0.31);
    }

    .topic-hot-line a {
        text-decoration: none;
        color: black;
    }

    .el-select-mini {
        margin: 4px 0;
        display: inline-block;
    }

    .el-select-mini .el-input .el-input__inner {
        height: 23px;
        line-height: 24px;
        background-color: #f2f3f5;
    }

    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .inline-block {
        display: inline-block;
        background: #F2F3F5;
    }

    .br-path {
        margin: 10px 0;
    }

    .el-col-right {
        text-align: right;
        line-height: 26px;
    }

</style>
<script type="text/javascript">
    import Body from '../compments/body.vue'
    import TopicLine from '../index/topicLine.vue'
    import {mapState} from 'vuex'
    import {mapActions} from 'vuex'
    export default  {
        name: 'area',
        data () {
            return {
                topics: [],
                page: this.$route.params.page ? this.$route.params.page : 1,
                area: this.$route.params.area,
                size: 30,
                total: 0,
                areaDescription: '',
                orderNow: this.$route.params.order ? this.$route.params.order : '1'
            }
        },
        created () {
            this.getData();
        },
        computed: mapState({
            orders: state => state.order,
            user: state => state.user
        }),
        watch: {
            $route(to, from) {
                this.updateBaseData();
                this.getData();
            },
            page(val, OldVal){
                this.getData();
            }
        },
        methods: {
            newTopic(){
                this.$router.push('/t/new/' + this.area);
            },
            pageChange(page){
                this.page = page;
            },
            updateBaseData(){
                this.page = this.$route.params.page ? this.$route.params.page : 1;
                this.area = this.$route.params.area;
                this.orderNow = this.$route.params.order ? this.$route.params.order : '1';
            },
            ...mapActions(["post"]),
            getData () {
                var url = '/a/' + this.area + "/" + this.page + '/' + this.orderNow;
                var that = this;
                that.post({
                    url: '/a/i/' + this.area
                }).then(function (data) {
                    if (data.result) {
                        that.areaDescription = data.data.area.description
                    }
                })
                that.post({
                    url: url
                }).then(function (data) {
                    if (data.result) {
                        that.topics = data.data.topics.result;
                        that.page = data.data.topics.pageNumber;
                        that.total = data.data.topics.totalCount;
                        that.size = data.data.topics.pageSize;
                    } else {
                        that.$message.error(data.message.length > 40 ? ( data.message.substring(0, 40) + "...") : data.message);
                    }
                }, function () {
                    that.$message.error('数据获取错误');
                })
            },
            nextPage () {
                this.page = this.page + 1;
            },
            prevPage () {
                this.page = this.page - 1;
            }
        },
        components: {
            'sg-body': Body,
            'sg-topic-Line': TopicLine
        }
    }
</script>