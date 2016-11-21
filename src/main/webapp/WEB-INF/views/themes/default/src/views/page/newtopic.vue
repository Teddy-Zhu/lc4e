<template>
    <sg-body>
        <slot>
            <el-row type="flex" justify="center">
                <el-col :span="15">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="区域名称" prop="area">
                            <el-select v-model="form.areaId" placeholder="请选择区域">
                                <el-option v-for="allowarea in areas" :label="allowarea.name"
                                           :value="allowarea.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input type="textarea" v-model="form.content"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" v-if="captcha" prop="captcha">
                            <el-input v-model="form.captcha"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-row class="publish">
                        <el-row :col="24">
                            主题发布公告
                        </el-row>
                    </el-row>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>

    .publish {
        min-height: 100px;
        padding: 10px 0;
        border-radius: 0.2em;
        background-color: white;
        margin-bottom: 1rem;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(162, 162, 162, 0.31);
    }

</style>
<script>
    import Body from '../compments/body.vue'
    import {mapActions} from 'vuex'

    export default{
        name: 'newTopic',
        data(){
            return {
                area: this.$route.params.area,
                areas: [],
                captcha: this.$store.state.config.captcha,
                form: {
                    title: '',
                    content: '',
                    captcha: '',
                    areaId: ''
                }
            }
        },
        methods: {
            ...mapActions(['post']),
            onSubmit(e){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.post({
                            url: '/t/new',
                            data: that.form
                        }).then(function (data) {
                            if (data.result) {
                                that.$router.push("/t/" + data["data"]["topic"]["id"]);
                                that.$message({
                                    message: '恭喜你，主题已发布',
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
            getData(){
                var that = this;
                this.post({
                    url: '/base/area'
                }).then(function (data) {
                    if (data.result) {
                        that.areas = data["data"]["areaList"];
                    } else {
                        that.$message.error('请填写必要信息');
                    }
                })
            },
            changeAreaChoosed(){
                for (var i = 0; i < this.areas.length; i++) {
                    if (this.areas[i].abbr == this.area) {
                        this.form.areaId = this.areas[i].id;
                        return;
                    }
                }
                this.$message.error("不存在此区域或此区域无法无法发布主题,请选择其他区域");
            },
            shouldChange(){
                return this.area && this.areas.length > 0;
            }
        },
        watch: {
            area(val, oldVal){
                this.shouldChange() && this.changeAreaChoosed();
            },
            areas(val, oldVal){
                this.shouldChange() && this.changeAreaChoosed();
            }
        },
        created(){
            this.getData();
        },
        components: {
            'sg-body': Body
        }
    }
</script>
