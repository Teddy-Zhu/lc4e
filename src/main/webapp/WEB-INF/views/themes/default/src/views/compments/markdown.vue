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
    import emoji from 'markdown-it-emoji'
    import footnote from 'markdown-it-footnote'
    import abbreviation from 'markdown-it-abbr'
    import mark from 'markdown-it-mark'
    import taskList from 'markdown-it-task-lists'
    import hljs from 'highlight.js';

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
            emoji: {
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
            render(){
                this.md = new markdownIt().use(footnote).use(abbreviation).use(mark).use(taskList);
                if (this.emoji) this.md.use(emoji)
                this.md.set({
                    html: this.html,
                    xhtmlOut: this.xhtmlOut,
                    breaks: this.breaks,
                    linkify: this.linkify,
                    typographer: this.typographer,
                    langPrefix: this.langPrefix,
                    quotes: this.quotes,
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
                this.md.renderer.rules.table_open = () => '<table class="' + this.tableClass + '">\n'
                var outHtml = this.show ? this.md.render(this.sourceOut) : ''
                this.outHtml = outHtml;
                this.$emit('rendered', outHtml);
            }
        }
    }
</script>
