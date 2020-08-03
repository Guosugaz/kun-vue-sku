<template>
    <div class="app">
        <vue-spec
            storeKey="store"
            :specArr="specArr"
            :defaultKey="defaultKey"
            @get-goods="handleSelectGoods"
            @active-img="hanldeActiveImg"
        />
        <ul>
            <li>已选</li>
            <li v-for="(value, key) in selectGoods" :key="key">{{key}}：{{value}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            selectGoods: {},
            defaultKey: ["id", "price", "store"],
            specArr: [
                {
                    id: 1,
                    price: 99,
                    store: 9,
                    颜色:
                        "粉色,https://inews.gtimg.com/newsapp_ls/0/12169344339_295195/0",
                    尺码: "小",
                    内存: "4g",
                },
                {
                    id: 2,
                    price: 99,
                    store: 9,
                    颜色: "粉色",
                    尺码: "小",
                    内存: "8g",
                },
                {
                    id: 3,
                    price: 33,
                    store: 99,
                    颜色: "粉色",
                    尺码: "大",
                    内存: "4g",
                },
                {
                    id: 4,
                    price: 99,
                    store: 9,
                    颜色: "黄色",
                    尺码: "小",
                    内存: "4g",
                },
                {
                    id: 5,
                    price: 14,
                    store: 99,
                    颜色: "蓝色",
                    尺码: "大",
                    内存: "8g",
                },
            ],
        };
    },
    methods: {
        // 获取选中的商品
        handleSelectGoods(goods) {
            this.selectGoods = goods ? goods : null;
            // console.log(goods)
        },
        // 获取点击有图片的商品
        hanldeActiveImg(goods) {
            // console.log(goods);
        },
    },
};
</script>

<style>
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}

body {
    line-height: 1.3;
    font-size: 14px;
    font-family: tahoma, arial, "Hiragino Sans GB", sans-serif;
    color: #333;
}

ol,
ul {
    list-style: none;
}

blockquote,
q {
    quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: "";
    content: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

.app {
    margin: 50px auto 0;
    width: 300px;
}
</style>
