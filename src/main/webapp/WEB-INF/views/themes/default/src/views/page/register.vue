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
                        <el-form-item label="重复密码" prop="rpassword">
                            <el-input type="password" v-model="form.rpassword"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nick">
                            <el-input v-model="form.nick"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="mail">
                            <el-input v-model="form.mail"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" v-if="captcha" prop="captcha">
                            <el-input v-model="form.captcha"></el-input>
                        </el-form-item>
                        <el-form-item label="个人网页" prop="web">
                            <el-input v-model="form.webBody">
                                <el-select v-model="form.webPre" slot="prepend" class="web-select">
                                    <el-option label="https://" key="https://" value="https://"></el-option>
                                    <el-option label="http://" key="http://" value="http://"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="生日" prop="birth">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.birth"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">注册</el-button>
                            <el-button @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>
    .web-select .el-input {
        width: 95px;
    }

    .formStyle {
        background: white;
        box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .25);
        padding: 3rem 3rem 1.1rem 3rem;
        margin: 2rem;
        border-radius: .2rem;
    }
</style>
<script>
    import Body from '../compments/front.vue'
    import {mapActions} from 'vuex'

    export default{
        name: 'register',
        data(){
            var that = this;
            var validateRPassword = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== that.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            var validateName = function (rule, value, callback) {
                that.validate('name', value, callback);
            };
            var validateNick = function (rule, value, callback) {
                that.validate('nick', value, callback);
            };

            var validateMail = function (rule, value, callback) {
                if (!new RegExp("^([0-9a-z_\.-]+)@([0-9a-z\.-]+)\.([a-z]{2,6})$").test(value)) {
                    callback(new Error("邮箱格式不正确"));
                    return;
                }
                that.validate('mail', value, callback);
            };

            return {
                validateInterval: undefined,
                form: {
                    webPre: 'https://',
                    name: '',
                    mail: '',
                    nick: '',
                    password: '',
                    rpassword: '',
                    captcha: '',
                    webBody: '',
                    phone: '',
                    birth: '',
                    web: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
                        {validator: validateName}
                    ],
                    nick: [
                        {required: true, message: '请输入用户昵称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
                        {validator: validateNick, trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: '请输入用户邮箱', trigger: 'blur'},
                        {validator: validateMail, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    rpassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: validateRPassword}
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
            getFormData(){
                var data = this.form;
                data.web = data.webPre + data.webBody;
                return data;
            },
            onSubmit(e){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.post({
                            url: '/u/register',
                            data: that.getFormData()
                        }).then(function (data) {
                            if (data.result) {
                                that.$router.push("/u/login");
                                that.$notify({
                                    title: '注册成功',
                                    message: '感谢注册,请继续登陆',
                                    type: 'success'
                                });
                            } else {
                                that.$message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + "..." : response.data.message);
                            }
                        })
                    } else {
                        this.$message({
                            message: '请填写必要信息',
                            type: 'warning'
                        });
                        return false;
                    }
                })
                ;
            },
            ...mapActions(['post']),
            validate(type, value, callback){
                var that = this;
                if (that.validateInterval) clearTimeout(that.validateInterval);
                that.validateInterval = setTimeout(function () {
                    that.post({
                        url: '/su/' + type,
                        data: {
                            name: value
                        }
                    }).then(function (data) {
                        if (data.result) {
                            callback();
                        } else {
                            callback(new Error(data.message.length > 40 ? data.message.substring(0, 40) + "..." : data.message))
                        }
                    })
                }, 400)
            }
        },
        components: {
            'sg-body': Body
        }
    }
</script>
