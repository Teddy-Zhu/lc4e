<template>
    <sg-background>
        <el-card class="box-card">
            <div v-for="o in 4" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>
    </sg-background>
</template>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 480px;
    }
</style>
<script>
    import BackGround from '../compments/background.vue'

    export default{
        name: 'backend',
        data(){
            return {}
        },
        components: {
            'sg-background': BackGround
        }
    }
</script>
