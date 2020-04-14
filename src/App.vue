<template>
    <div class="app">
        <vue-spec
            :specArr="specArr"
            :defaultKey="defaultKey"
            @get-goods="handleSelectGoods"
            @active-img="hanldeActiveImg"
        />
        <ul>
            <li>已选</li>
            <li v-for="(key, value) in selectGoods" :key="key">{{key}}：{{value}}</li>
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
                    尺码:
                        "L,https://img10.360buyimg.com/n1/s30x30_jfs/t1/102755/29/17884/214230/5e8d5900E5cbe2970/438d2a49b477cd91.png",
                    颜色: "红色",
                    内存: "8g"
                },
                {
                    id: 2,
                    price: 33,
                    store: 99,
                    尺码:
                        "M,https://img10.360buyimg.com/n1/s30x30_jfs/t1/87864/17/18053/155430/5e8d58ffEc4b14fd6/dce191b5d9a44154.jpg",
                    颜色: "蓝色",
                    内存: "4g"
                },
                {
                    id: 3,
                    price: 14,
                    store: 99,
                    尺码:
                        "L,https://img10.360buyimg.com/n1/s30x30_jfs/t1/102755/29/17884/214230/5e8d5900E5cbe2970/438d2a49b477cd91.png",
                    颜色: "蓝色",
                    内存: "5g"
                }
            ]
        };
    },
    methods: {
        // 获取选中的商品
        handleSelectGoods(goods) {
            this.selectGoods = goods ? goods : null;
        },
        // 获取点击有图片的商品
        hanldeActiveImg(goods) {
            console.log(goods);
        }
    }
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
