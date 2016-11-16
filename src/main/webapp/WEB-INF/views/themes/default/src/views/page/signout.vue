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
                that.$router.push("/")
            });
        },
        methods: {
            ...mapActions(['signout'])
        }
    }
</script>
