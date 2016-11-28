<template>
</template>
<style>
</style>
<script>
    import {mapActions} from 'vuex'

    export default{
        data(){
            return {}
        },
        created(){
            var that = this;
            this.signout().then((response)=> {
                that.$notify({
                    title: '退出成功',
                    message: '您已成功退出',
                    type: 'success'
                });
                that.$router.push("/")
            });
        },
        methods: {
            ...mapActions(['signout'])
        }
    }
</script>
