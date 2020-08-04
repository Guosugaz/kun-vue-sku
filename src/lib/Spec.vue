<template>
    <div v-if="hasShowInfo" class="spec-wrap">
        <div v-for="(arr, key) in showInfo" :key="key" class="spec-con">
            <span class="spec-label">{{key}}:</span>
            <ul class="list spec-list">
                <li
                    v-for="(item, index) in arr"
                    :key="index"
                    class="spec-item"
                    :class="{ disable: item.disable, active: item.active }"
                    @click="handleSelect(key, item, index)"
                >
                    <img v-if="item.img" class="spec-img" :src="item.img" height="30" width="30" />
                    <span class="spec-text">{{item.value}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "VueSku",
    props: {
        // sku数组
        specArr: {
            type: Array,
            required: true,
        },
        // 非规格值，如: price store
        defaultKey: {
            type: Array,
        },
        // 库存的字段
        storeKey: {
            type: String,
            default: "store",
        },
    },
    data() {
        return {
            selectKeys: [], // 选中的规格的keys 格式为：["", "", ""]
            skuPartNameStock: {}, // 不完整了sku的库存
            skuStock: {}, // 完整的sku的库存和id
            copySeArr: [], // 复制this.specArr
            select: {}, // 选中的规格
            showInfo: {}, // 展示的规格值
        };
    },
    watch: {
        specArr() {
            this.init();
        },
    },
    created() {
        this.init();
    },
    computed: {
        // showInfo的keys
        showInfoKeys() {
            return Object.keys(this.showInfo);
        },
        // 是否有规格展示
        hasShowInfo() {
            return !!this.showInfoKeys.length;
        },
    },
    methods: {
        init() {
            this.skuPartNameStock = {};
            this.skuStock = {};
            this.copySeArr = this.specArr;
            this.showInfo = this.getInfo();
            this.getRemainByKey();
            this.getSelectKeys();
            this.handleNoShowInfo();
        },
        // 获取 selectKeys
        getSelectKeys() {
            let arr = [];
            this.showInfoKeys.forEach((key, index) => {
                arr[index] = this.select[key] ? this.select[key] : "";
            });
            this.selectKeys = arr;
        },
        // 获取要展示的数据结构
        getInfo() {
            const spec = {};

            this.copySeArr.forEach((item) => {
                const valueArr = [];
                for (let key in item) {
                    if (this.isThatKey(key)) {
                        let objV = spec[key];
                        let value;
                        let itemVal = {};
                        if (item[key].indexOf(",") > -1) {
                            // 有图片的情况
                            let [val, ...img] = item[key].split(",");
                            img = img.join(","); // 防止有多个 , 的情况
                            itemVal = {
                                disable: false,
                                active: false,
                                value: val,
                                img,
                            };
                            value = val;
                        } else {
                            itemVal = {
                                disable: false,
                                active: false,
                                value: item[key],
                            };
                            value = item[key];
                        }
                        valueArr.push(value);
                        if (objV) {
                            if (objV.every((arrI) => arrI.value !== value)) {
                                spec[key].push(itemVal);
                            }
                        } else {
                            spec[key] = [itemVal];
                        }
                    }
                }
                // 插入完成的sku 库存和id
                this.skuStock[valueArr.join("-")] = `${item[this.storeKey]},${
                    item.id
                }`;
            });
            return spec;
        },
        // 处理选择规格事件
        handleSelect(key, { disable, value, img }, index) {
            if (disable) return;
            if (this.copySeArr.length === 1) return;
            // 处理激活状态
            if (this.select[key] !== value) {
                // 把同一个规格的全部类型设为非激活
                this.showInfo[key].forEach((item, index) => {
                    this.showInfo[key][index].active = false;
                });
                // 对应的规格值设为激活
                this.showInfo[key][index].active = true;
                // 把给规格值设为选中
                this.select[key] = value;
                // 设置激活的图片
                if (img) {
                    this.$emit(
                        "active-img",
                        this.copySeArr.find(
                            (item) => item[key].split(",")[0] === value
                        )
                    );
                }
            }
            // 处理取消状态
            else {
                // 对应的规格值设为非激活
                this.showInfo[key][index].active = false;
                // 删除对应选中的规格
                delete this.select[key];
                this.$emit("get-goods", null);
            }

            this.getSelectKeys();

            this.fetchStatus();

            // 全部都选择好时获取商品
            if (Object.keys(this.select).length === this.showInfoKeys.length) {
                let _id = this.skuStock[this.selectKeys.join("-")].split(
                    ","
                )[1];
                let goods = this.copySeArr.find(({ id }) => _id == id);
                this.$emit("get-goods", goods);
            }
        },
        // 更新状态
        fetchStatus() {
            // 根据已选择的sku来筛选库存
            this.showInfoKeys.forEach((key, skuIdx) => {
                let sku = this.showInfo[key];
                const curSelected = this.selectKeys.slice();

                // 已选的不用更新
                sku.forEach((skuInfo) => {
                    // 已选择规格的跳过
                    if (skuInfo.active) return;

                    // 将不同sku代入计算库存
                    const cacheKey = curSelected[skuIdx];
                    // 组合没选中的值和已选中的值
                    curSelected[skuIdx] = skuInfo.value;
                    // 获取不同组合的库存
                    const stock = this.getRemainByKey(
                        curSelected.filter((item) => item)
                    );
                    curSelected[skuIdx] = cacheKey;

                    // 更新sku状态
                    skuInfo.disable = stock <= 0;
                });
            });
        },
        /**
         * sku算法 获取已选择sku的库存数
         * @param {Array} selected 已选择的sku数组 ["粉丝", "L"]
         */
        getRemainByKey(selected = []) {
            const { skuStock, skuPartNameStock, showInfo, showInfoKeys } = this;
            const selectedJoin = selected.join("-");
            // 如果已有缓存则返回
            if (typeof skuPartNameStock[selectedJoin] !== "undefined") {
                return skuPartNameStock[selectedJoin];
            }
            // 所有sku已选择 及时缓存
            if (selected.length === showInfoKeys.length) {
                skuPartNameStock[selectedJoin] = skuStock[selectedJoin]
                    ? Number(skuStock[selectedJoin].split(",")[0])
                    : 0;
                return skuPartNameStock[selectedJoin];
            }

            let remainStock = 0;
            const willSelected = [];

            for (let i = 0; i < showInfoKeys.length; i += 1) {
                let thatArr = this.showInfo[showInfoKeys[i]];
                // 对应规格的sku是否已选择
                const exist = thatArr.find(
                    ({ value }) => value === selected[0]
                );
                if (exist && selected.length > 0) {
                    willSelected.push(selected.shift());
                } else {
                    // 对应sku未选择，则遍历该规格所有sku
                    for (let j = 0; j < thatArr.length; j += 1) {
                        remainStock += this.getRemainByKey(
                            willSelected.concat(thatArr[j].value, selected)
                        );
                    }
                    break;
                }
            }
            // 返回前缓存
            skuPartNameStock[selectedJoin] = remainStock;
            return skuPartNameStock[selectedJoin];
        },
        // 处理没有可展示规格的情况
        handleNoShowInfo() {
            // 没有规格时自动选中第一个商品
            if (!this.hasShowInfo && this.copySeArr.length) {
                this.$emit("get-goods", this.copySeArr[0]);
            }
            // 只有一个商品时自动选中
            else if (this.copySeArr.length === 1) {
                for (const key in this.showInfo) {
                    this.showInfo[key][0].active = true;
                }
                this.$emit("get-goods", this.copySeArr[0]);
            } else {
                this.$emit("get-goods", null);
            }
        },
        // 确实是否为规格值
        isThatKey(key) {
            return this.defaultKey.every((item) => item !== key);
        },
    },
};
</script>

<style scoped>
.spec-wrap {
    margin-top: 10px;
}
.spec-label,
.spec-list {
    display: inline-block;
    vertical-align: top;
}
.spec-label {
    width: 60px;
    font-size: 12px;
    color: #888;
}
.spec-list {
    margin-left: 10px;
}
.spec-item {
    float: left;
    margin: 0 10px 10px 0;
    padding: 4px 6px;
    cursor: pointer;
    border: 1px solid #eee;
    user-select: none;
}
.spec-item:hover,
.spec-item.active {
    padding: 3px 5px;
    color: #ff8080;
    border: 2px solid #ff8080;
}
/* .spec-item.active {
    position: relative;
} */
/* .spec-item.active::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: 0;
    right: 0;
    background: url("../assets/img/goods-select.gif");
} */
.spec-item.disable {
    padding: 3px 5px;
    color: #dedede;
    cursor: not-allowed;
    border: 2px dotted #eee;
}

.spec-img,
.spec-text {
    vertical-align: middle;
}
</style>