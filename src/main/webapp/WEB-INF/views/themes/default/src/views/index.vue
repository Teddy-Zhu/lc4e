<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="15">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="13" class="br-path">
                            <el-breadcrumb separator=">">
                                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item>Area</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-col>
                        <el-col :span="5">
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
                    <el-row>
                        <el-col :span="24">
                            <sg-topic-Line :data="data" v-for="data in topics"></sg-topic-Line>
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
                    <el-row class="topic-hot">
                        <el-col :span="24">
                            <h3>Topic Hot</h3>
                        </el-col>
                        <el-col :span="24" class="topic-hot-line" v-for="hot in hots">
                            <el-tag type="primary">
                                <router-link tag="a" :to="'/a/' + hot.area">{{hot.area}}</router-link>
                            </el-tag>
                            <router-link tag="a" :to="hot.link">{{hot.title}}</router-link>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>

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
        border-radius: 0.2em;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(162, 162, 162, 0.31);
    }

    .topic-hot-line a {
        text-decoration: none;
        color: black;
    }

    .el-select-mini {
        margin: 5px 0;
    }

    .el-select-mini .el-input__inner {
        height: 24px;
        background-color: #f2f3f5;
    }

    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .inline-block {
        display: inline-block;
    }

    .br-path {
        margin: 10px 0;
    }
</style>
<script type="text/javascript">
    import Body from './compments/body.vue'
    import Pager from './others/pager.vue'
    import TopicLine from './index/topicLine.vue'
    export default  {
        name: 'index',
        data () {
            return {
                menus: preLoadData.menus,
                topics: [],
                page: 1,
                size: 30,
                total: 0,
                orderNow: '1',
                orders: [{
                    value: '1',
                    label: '最新发布'
                }, {
                    value: '2',
                    label: '最后回复'
                }, {
                    value: '3',
                    label: '个人喜好'
                }],
                hots: [{
                    area: 'c++',
                    link: '/asd',
                    title: 'xx'
                }, {
                    area: 'c++',
                    link: '/asd',
                    title: 'casasdassss'
                }, {
                    area: 'c++',
                    link: '/asd',
                    title: 'asds'
                }, {
                    area: 'c++',
                    link: '/asd',
                    title: 'asds'
                }]
            }
        },
        created () {
            this.getData();
        },
        watch: {
            $route() {
                this.getData();
            },
            page(val, OldVal){
                this.getData();
            }
        },
        methods: {
            pageChange(page){
                this.page = page;
            },
            getData () {
                var url = '/' + this.page + '/' + this.orderNow;

                this.$http.post(url).then((response)=> {
                    if (response.data.result) {
                        this.topics = response.data.data.topics.result;
                        this.page = response.data.data.topics.pageNumber;
                        this.total = response.data.data.topics.totalPage;
                        this.size = response.data.data.topics.pageSize;
                    }
                }, (response)=> {
                });
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
            'sg-pager': Pager,
            'sg-topic-Line': TopicLine
        }
    }
</script>