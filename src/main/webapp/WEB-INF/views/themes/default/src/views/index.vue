<template>
    <sg-body>
        <slot>
            <el-row>
                <el-col :span="17">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="15" class="br-path">
                            <el-breadcrumb separator=">">
                                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item>Area</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-col>
                        <el-col :span="3">
                            <el-select v-model="order" class="el-select-mini">
                                <el-option
                                        v-for="orderItem in orders"
                                        :label="orderItem.label"
                                        :value="orderItem.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <sg-topic-Line :data="data" v-for="data in topics"></sg-topic-Line>
                    <el-row type="flex" justify="center">
                        <el-col :span="24" class="pager-center">
                            <sg-pager :pageNow="page" :pageSize="size" :pageTotal="total"
                                      @currentchange="pageChange" class="inline-block"></sg-pager>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="7">
                    <p>right</p>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>
    .el-select-mini {
        margin: 5px 0;
    }

    .order-select .el-input__inner {
        height: 24px;
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
                total: 100,
                order: 1,
                orders: [{
                    value: '1',
                    label: '最新发布'
                }, {
                    value: '2',
                    label: '最后回复'
                }, {
                    value: '3',
                    label: '个人喜好'
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
                var url = '/' + this.page + '-' + this.order;

                this.$http.post(url).then((response)=> {
                    if (response.data.result) {
                        this.topics = response.data.data.topics;
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