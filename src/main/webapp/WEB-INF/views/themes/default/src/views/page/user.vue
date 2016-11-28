<template>
    <sg-body>
        <slot>
            <el-row type="flex" justify="center">
                <el-col :span="23" :offset="1">

                </el-col>
            </el-row>
        </slot>
    </sg-body>
</template>
<style>
</style>
<script>
    import Body from '../compments/body.vue'
    import {mapActions} from 'vuex'


    export default{
        name: 'userInfo',
        data(){
            return {
                id: this.$route.params.id
            }
        },
        create(){
            this.getData();
        },
        method: {
            getData(){
                this.post({
                    url: '/u/' + id
                }).then(function (data) {
                    if (data.result) {

                    } else {

                    }
                })
            },
            ...mapActions(["post"])
        },
        components: {
            'sg-body': Body
        }
    }
</script>
