# Kun-Vue-Sku
> 用Vue实现了sku选择

## Demo
https://guosugaz.gitee.io/kun-vue-sku/

 ## 快速运行
 ###  1. 安装
 ```bash
npm install --save kun-vue-sku
```
```js
import Vue from 'vue';
import VueSku from 'kun-vue-sku';

Vue.use(VueSku);
```
 ###  2. 使用
 ```html
<VueSku 
    :specArr="specArr" 
    :defaultKey="defaultKey"
    storeKey="store"
    @get-goods="handleSelectGoods"
    @active-img="hanldeActiveImg"
/>
```

```js
export default {
    data() {
        return {
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
                }
            ]
        };
    },
    methods: {
        // 获取选中的商品
        handleSelectGoods(goods) {
            console.log(goods);
        },
        // 获取点击有图片的商品
        hanldeActiveImg(goods) {
            console.log(goods);
        }
    }
};
```

### 参数

| Param | Type | Describe | default | Version |
| :------: | :------: | :------: | :------: | :-----: |
| specArr | Object[] | 商品数组,每个item必须有id | | |
| defaultKey | String[] | 非sku的字段，如id，price | | |
| storeKey | String | 库存的字段 | store |

### callback

| Event | Type | Describe | Version |
| :------: | :------: | :------: | :-----: |
| get-goods | Function  | 获取到商品时回调 | |
| active-img | Function | 点击带有图片的规格 | |


