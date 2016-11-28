<template>
    <sg-body>
        <slot>
            <el-row type="flex" justify="center">
                <el-col :span="10" class="formStyle">
                    <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="6rem">
                        <el-form-item label="用户名" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="form.password"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" v-if="captcha" prop="captcha">
                            <el-input v-model="form.captcha"></el-input>
                        </el-form-item>
                        <el-form-item label="记住我" prop="rememberMe">
                            <el-switch on-text="" off-text="" v-model="form.rememberMe"></el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登陆</el-button>
                            <el-button @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>
    .formStyle {
        background: white;
        box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .25);
        padding: 3rem 3rem 1.1rem 3rem;
        margin: 2rem;
        border-radius: .2rem;
    }
</style>
<script>
    import Body from '../compments/body.vue'
    import {mapActions} from 'vuex'

    export default{
        name: 'login',
        data(){
            return {
                form: {
                    name: '',
                    password: '',
                    captcha: '',
                    rememberMe: false
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    captcha: [
                        {min: 4, max: 4, message: '长度只能为4', trigger: 'blur'}
                    ]
                },
                captcha: this.$store.state.config.captcha
            }
        },
        methods: {
            reset() {
                this.$refs.form.resetFields();
            },
            onSubmit(e){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.signin(that.form).then(function (data) {
                            if (data.result) {
                                that.$router.push("/");
                                that.$notify({
                                    title: '登陆成功',
                                    message: '欢迎回来~~,' + data["data"]["user"]["nick"],
                                    type: 'success'
                                });
                            } else {
                                that.$message.error(data.message.length > 40 ? data.message.substring(0, 40) + "..." : data.message)
                            }
                        });
                    } else {
                        that.$message({
                            message: '请填写必要信息',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            ...mapActions(['signin'])
        },
        components: {
            'sg-body': Body
        }
    }
</script>
