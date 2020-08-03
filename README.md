# Kun-Vue-Sku
 > 用Vue实现了sku选择

 ## Demo
 ``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

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
    name: "App",
    data() {
        return {
            defaultKey: ["price"],
            specArr: [
                {
                    id: 1,
                    price: 99,
                    store: 9,
                    尺码: "L",
                    颜色: "红色",
                    内存: "8g"
                },
                {
                    id: 2,
                    price: 33,
                    store: 99,
                    尺码: "M",
                    颜色: "蓝色",
                    内存: "4g"
                },
                {
                    id: 3,
                    price: 14,
                    store: 99,
                    尺码: "L",
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
```

### 参数

| Param | Type | Describe | default | Version |
| :------: | :------: | :------: | :------: | :-----: |
| specArr | Object[] | 商品数组,每个item必须有id | | |
| defaultKey | String[] | 非sku的字段，如price | | |
| storeKey | String | 库存的字段 | store |

### callback

| Event | Type | Describe | Version |
| :------: | :------: | :------: | :-----: |
| get-goods | Function  | 获取到商品时回调 | |
| active-img | Function | 点击带有图片的规格 | |


