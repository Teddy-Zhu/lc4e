<template>
    <el-row type="flex" justify="center" class="bg-black-light">
        <el-col :span="22">
            <div class="footer-des">
                <p>{{siteName}} {{version}}</p>
                <a class="footer-a" target="_blank"
                   href="http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html">JDK8</a>
                <a class="footer-a" target="_blank" href="https://github.com/Teddy-Zhu/SilentGo">SilentGo</a>
                <a class="footer-a" target="_blank" href="https://github.com/vuejs/vue">Vue2</a>
            </div>
            <div class="footer-icon">
                <a href="https://github.com/Teddy-Zhu/lc4e" target="_blank">
                    <i class="iconfont icon-github"></i>
                </a>
            </div>
        </el-col>
    </el-row>
</template>
<style>
    .footer-des {
        display: inline-block;
    }

    .footer-des p {
        color: white;
    }

    .footer-a {
        display: inline-block;
        margin: 0 11px 12px 0;
        line-height: 1;
        font-size: 12px;
        color: #768193;
        text-decoration: none;
    }

    .footer-icon a i {
        font-size: 25px;
    }

    .footer-icon a {
        color: white;
        text-decoration: none;
    }

    .footer-icon {
        padding-top: 1em;
        float: right;
    }
</style>
<script>

    export default{
        name: 'sg-footer',
        props: {
            siteName: {
                type: String
            },
            version: {
                type: String
            }
        }
    }
</script>
