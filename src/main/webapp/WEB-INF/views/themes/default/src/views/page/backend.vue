<template>
    <sg-background>
        <sg-back-menu></sg-back-menu>
    </sg-background>
</template>
<style>

</style>
<script>
    import BackGround from '../compments/background.vue'
    import BackMenu from '../background/menu.vue'

    export default{
        name: 'backend',
        data(){
            return {}
        },
        components: {
            'sg-background': BackGround,
            'sg-back-menu': BackMenu
        }
    }
</script>
