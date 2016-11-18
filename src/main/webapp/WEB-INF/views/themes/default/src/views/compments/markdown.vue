<template>
    <el-row>
        <el-col :span="24">
            <slot></slot>
        </el-col>
    </el-row>
</template>
<style>
</style>
<script>
    import markdownIt from 'markdown-it'
    import emoji from 'markdown-it-emoji'
    import subscript from 'markdown-it-sub'
    import superscript from 'markdown-it-sup'
    import footnote from 'markdown-it-footnote'
    import deflist from 'markdown-it-deflist'
    import abbreviation from 'markdown-it-abbr'
    import insert from 'markdown-it-ins'
    import mark from 'markdown-it-mark'
    import toc from 'markdown-it-toc-and-anchor'

    export default {
        name: 'sg-markdown',
        data() {
            return {
                md: new markdownIt(),
                el: undefined,
                sourceOut: ''
            }
        },
        props: {
            watches: {
                type: Array,
                default: () => ['source', 'show', 'toc'],
            },
            source: {
                type: String,
                default: ``,
            },
            show: {
                type: Boolean,
                default: true,
            },
            html: {
                type: Boolean,
                default: true,
            },
            xhtmlOut: {
                type: Boolean,
                default: true,
            },
            breaks: {
                type: Boolean,
                default: true,
            },
            linkify: {
                type: Boolean,
                default: true,
            },
            emoji: {
                type: Boolean,
                default: true,
            },
            typographer: {
                type: Boolean,
                default: true,
            },
            langPrefix: {
                type: String,
                default: 'language-',
            },
            quotes: {
                type: String,
                default: '“”‘’',
            },
            tableClass: {
                type: String,
                default: 'table',
            },
            toc: {
                type: Boolean,
                default: false,
            },
            tocId: {
                type: String,
            },
            tocClass: {
                type: String,
                default: 'table-of-contents',
            },
            tocFirstLevel: {
                type: Number,
                default: 2,
            },
            tocLastLevel: {
                type: Number,
            },
            tocAnchorLink: {
                type: Boolean,
                default: true,
            },
            tocAnchorClass: {
                type: String,
                default: 'toc-anchor',
            },
            tocAnchorLinkSymbol: {
                type: String,
                default: '#',
            },
            tocAnchorLinkSpace: {
                type: Boolean,
                default: true,
            },
            tocAnchorLinkClass: {
                type: String,
                default: 'toc-anchor-link',
            },
        },
        watch: {
            source(){
                this.el && this.render(this.el);
            },
            show(){
                this.el && this.render(this.el);
            },
            toc(){
                this.el && this.render(this.el);
            }
        },
        created(){
            console.log('markdown created');
        },
        computed: {
            tocLastLevelComputed() {
                return (!this.tockLastLevel) ? this.tocFirstLevel + 1 : this.tocLastLevel;
            }
        },
        beforeDestroy(){
            console.log("before destroy");
        },
        destroyed(){
            console.log("before destroyed");
        },
        updated(){
            this._inactive = false;
        },
        methods: {
            render(root){
                this.md = new markdownIt().use(subscript).use(superscript)
                        .use(footnote).use(deflist).use(abbreviation).use(insert).use(mark)
                if (root.emoji) this.md.use(emoji)
                this.md.set({
                    html: root.html,
                    xhtmlOut: root.xhtmlOut,
                    breaks: root.breaks,
                    linkify: root.linkify,
                    typographer: root.typographer,
                    langPrefix: root.langPrefix,
                    quotes: root.quotes,
                })
                this.md.renderer.rules.table_open = () => `<table class="${root.tableClass}">\n`
                if (root.toc) {
                    this.md.use(toc, {
                        tocClassName: root.tocClass,
                        tocFirstLevel: root.tocFirstLevel,
                        tocLastLevel: root.tocLastLevelComputed,
                        anchorLink: root.tocAnchorLink,
                        anchorLinkSymbol: root.tocAnchorLinkSymbol,
                        anchorLinkSpace: root.tocAnchorLinkSpace,
                        anchorClassName: root.tocAnchorClass,
                        anchorLinkSymbolClassName: root.tocAnchorLinkClass,
                        tocCallback: (tocMarkdown, tocArray, tocHtml) => {
                            if (tocHtml) {
                                if (root.tocId && document.getElementById(root.tocId))
                                    document.getElementById(root.tocId).innerHTML = tocHtml
                                root.$emit('toc-rendered', tocHtml)
                            }
                        },
                    })
                } else if (root.tocId && document.getElementById(root.tocId))
                    document.getElementById(root.tocId).innerHTML = ''
                const outHtml = root.show ? this.md.render(root.sourceOut) : ''
                root.$el.innerHTML = outHtml
                root._inactive = false;
                root.$emit('rendered', outHtml)
                console.log('rendered end');
            }
        },
        mounted() {
            if (this.$el.childNodes.length > 0) {
                this.source = '';
                for (let el of this.$el.childNodes) {
                    this.sourceOut += (el.outerHTML ? el.outerHTML : el.textContent)
                }
            }
            this.render(this);
            this.el = this;
        }
    }
</script>
