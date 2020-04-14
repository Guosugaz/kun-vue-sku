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
    props: {
        // sku数组
        specArr: {
            type: Array,
            required: true
        },
        // 非规格值，如：id price store
        defaultKey: {
            type: Array
        },
        // 库存的字段
        storeKey: {
            type: String,
            default: "store"
        }
    },
    name: "GoodsSpec",
    data() {
        return {
            copySeArr: [], // 复制this.specArr
            select: {}, // 选中的规格
            showInfo: {}, // 规格值属性
            canSelectArr: [] // 可选择的商品数组
        };
    },
    watch: {
        specArr() {
            this.init();
        }
    },
    created() {
        this.init();
    },
    computed: {
        hasShowInfo() {
            return !!Object.keys(this.showInfo).length;
        }
    },
    methods: {
        init() {
            this.copySeArr = this.specArr;
            this.showInfo = this.getInfo();
            this.handleNoShowInfo();
        },
        // 获取要展示的数据结构
        getInfo() {
            const spec = {};
            this.copySeArr.forEach(item => {
                if (!item[this.storeKey]) return; // 没有库存的直接跳过
                for (let key in item) {
                    if (this.isThatKey(key)) {
                        let objV = spec[key];
                        let value;
                        let itemVal = {};
                        if (item[key].indexOf(",") > -1) {
                            // 有图片的情况
                            let [val, img] = item[key].split(",");
                            itemVal = {
                                disable: false,
                                active: false,
                                value: val,
                                img
                            };
                            value = val;
                        } else {
                            itemVal = {
                                disable: false,
                                active: false,
                                value: item[key]
                            };
                            value = item[key];
                        }
                        if (objV) {
                            if (objV.every(arrI => arrI.value !== value)) {
                                spec[key].push(itemVal);
                            }
                        } else {
                            spec[key] = [itemVal];
                        }
                    }
                }
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
                    this.$emit("active-img", this.copySeArr.find(item => item[key].split(",")[0] === value));
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

            // 当没有选择时重置全部选项的可选性
            if (!Object.keys(this.select).length) {
                this.showInfo = this.getInfo();
                return;
            }
            // 处理可否能选择
            this.handleDisable();

            // 当都选择完时，直接拿出对应的商品
            if (
                Object.keys(this.showInfo).length ===
                Object.keys(this.select).length
            ) {
                // 获取商品
                this.$emit("get-goods", this.canSelectArr[0]);
            }
        },
        // 处理规格是否可选择
        handleDisable() {
            let canSelectArr = []; // // 能够选择的商品集合
            let canSelect = {}; // 能够选择的组合对象
            for (let seKey in this.select) {
                let tmp = [];
                let obj = {};
                let arr = canSelectArr.length ? canSelectArr : this.copySeArr;
                tmp = arr.filter(
                    goodsItem =>
                        goodsItem[seKey] &&
                        goodsItem[this.storeKey] &&
                        goodsItem[seKey].replace(/,\S+/g, "") ===
                            this.select[seKey]
                );
                // 将缓冲的可选商品集合里转为对象格式，和showInfo格式相同，做对比
                tmp.forEach(item => {
                    for (let itemKey in item) {
                        if (this.isThatKey(itemKey)) {
                            let itemVal = item[itemKey].replace(/,\S+/g, "");
                            if (!obj[itemKey]) {
                                obj[itemKey] = [itemVal];
                            } else {
                                if (obj[itemKey].indexOf(itemVal) < 0) {
                                    obj[itemKey].push(itemVal);
                                }
                            }
                        }
                    }
                });
                canSelectArr = tmp;
                canSelect = obj;
            }
            this.canSelectArr = canSelectArr;

            // 将获取的可选商品对象来设置是否可选
            for (let showKey in this.showInfo) {
                if (!canSelect[showKey]) {
                    this.showInfo[showKey].forEach((showItem, ind) => {
                        this.showInfo[showKey][ind].disable = true;
                    });
                } else {
                    this.showInfo[showKey].forEach((showItem, ind) => {
                        if (canSelect[showKey].indexOf(showItem.value) > -1) {
                            this.showInfo[showKey][ind].disable = false;
                        } else {
                            this.showInfo[showKey][ind].disable = true;
                        }
                    });
                }
            }
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
            return this.defaultKey.every(item => item !== key);
        }
    }
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
    background: #f7f7f7;
    cursor: pointer;
    border: 1px solid #eee;
    user-select: none;
}
.spec-item:hover,
.spec-item.active {
    padding: 3px 5px;
    border: 2px solid #ff8080;
}
.spec-item.active {
    position: relative;
}
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
    background: #fff;
    color: #999;
    cursor: not-allowed;
    border: 2px dotted #eee;
}

.spec-img,
.spec-text {
    vertical-align: middle;
}
</style>