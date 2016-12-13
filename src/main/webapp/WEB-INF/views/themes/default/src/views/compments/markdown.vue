<template>
    <el-row class="markdown-body" v-bind:class="{'markdown-body-extra' : isEditor }">
        <el-col :span="24" v-html="outHtml">
        </el-col>
    </el-row>
</template>
<style scoped>
    .markdown-body {
        margin-top: 8px;
        padding: 5px 7px;
    }

    .markdown-body-extra {
        margin-top: 8px;
        padding: 5px 7px;
        background-color: white;
        max-height: 300px;
        min-height: 100px;
        overflow: auto;
    }

</style>
<script>
    import markdownIt from 'markdown-it'

    import "../../markdown/markdown.css"
    import "highlight.js/styles/atom-one-light.css"
    export default {
        name: 'sg-markdown',
        data() {
            return {
                md: undefined,
                outHtml: ''
            }
        },
        props: {
            isEditor: {
                type: Boolean,
                default: true
            },
            sourceOut: {
                type: String,
                default: ''
            },
            watches: {
                type: Array,
                default: () => ['source', 'show', 'toc']
            },
            source: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: true
            },
            html: {
                type: Boolean,
                default: false
            },
            xhtmlOut: {
                type: Boolean,
                default: true
            },
            breaks: {
                type: Boolean,
                default: true
            },
            linkify: {
                type: Boolean,
                default: true
            },
            typographer: {
                type: Boolean,
                default: true
            },
            langPrefix: {
                type: String,
                default: 'language-'
            },
            quotes: {
                type: String,
                default: '“”‘’'
            },
            tableClass: {
                type: String,
                default: 'table'
            }
        },
        watch: {
            sourceOut(){
                this.render();
            },
            source(){
                this.render();
            },
            show(){
                this.render();
            }
        },
        created(){
            this.render();
        },
        computed: {
            tocLastLevelComputed() {
                return (!this.tockLastLevel) ? this.tocFirstLevel + 1 : this.tocLastLevel;
            }
        },
        methods: {
            renderHtml(){
                var outHtml = this.show ? this.md.render(this.sourceOut) : '';
                this.outHtml = outHtml;
                this.$emit('rendered', outHtml);
            },
            getEmoji(){

            },
            render(){
                if (!this.md) {
                    var that = this;
                    var emojiPro = new Promise(function (resolve, reject) {
                        require(['markdown-it-emoji'], resolve);
                    });
                    var footNotePro = new Promise(function (resolve, reject) {
                        require(['markdown-it-footnote'], resolve);
                    });
                    var abbrPro = new Promise(function (resolve, reject) {
                        require(['markdown-it-abbr'], resolve);
                    });
                    var markPro = new Promise(function (resolve, reject) {
                        require(['markdown-it-mark'], resolve);
                    });
                    var taskListPro = new Promise(function (resolve, reject) {
                        require(['markdown-it-task-lists'], resolve);
                    });
                    var highPro = new Promise(function (resolve, reject) {
                        require(['highlight.js'], resolve);
                    });

                    Promise.all([emojiPro, footNotePro, abbrPro, markPro, taskListPro, highPro]).then(function (result) {
                        that.md = new markdownIt();
                        for (var i = 0, len = result.length - 1; i < len; i++) {
                            that.md.use(result[i]);
                        }
                        var hljs = result[result.length - 1];
                        that.md.set({
                            html: that.html,
                            xhtmlOut: that.xhtmlOut,
                            breaks: that.breaks,
                            linkify: that.linkify,
                            typographer: that.typographer,
                            langPrefix: that.langPrefix,
                            quotes: that.quotes,
                            highlight: function (str, lang) {
                                if (lang && hljs.getLanguage(lang)) {
                                    try {
                                        return hljs.highlight(lang, str).value;
                                    } catch (__) {
                                    }
                                }
                                return '';
                            }
                        });
                        that.md.renderer.rules.table_open = () => '<table class="' + that.tableClass + '">\n'
                        that.renderHtml();
                    });
                } else {
                    this.renderHtml();
                }

            }
        }
    }
</script>
