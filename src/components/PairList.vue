<template>
    <div class="vika-pair-list">
        <div class="setting-item vika-pair-list--p-0"> </div>
        <div class="setting-item" v-for="(pair, i) in pairs" :key="pair.id">
            <Pair v-model:label="pair.ob" label-label="OB" v-model:value="pair.vika" @change="onChange"
                value-label="Vika">
                <template #suffix>
                    <button v-icon="'cross'" @click="onRemove(i)"></button>
                </template>
            </Pair>
        </div>
        <div class="setting-item vika-pair-list--ctrls">
            <ElButton @click="onAdd">增加一条</ElButton>
        </div>

        <Autocomplete v-model="state1" :fetch-suggestions="querySearch" clearable class="inline-input w-50"
            placeholder="Please Input" @select="handleSelect" />
        <Multiselect v-model="value" :options="options" />
    </div>
</template>

<script lang="ts">
import 'element-plus/dist/index.css';
// import "element-plus/es/components/autocomplete/style/css";
// import "element-plus/es/components/autocomplete/style/index";
import Autocomplete from "element-plus/es/components/autocomplete/index";
import { ElButton } from "element-plus";
// Optional: Import default CSS
import "@vueform/multiselect/themes/default.css";
import Multiselect from '@vueform/multiselect';
import { TapMap } from "src/Vika.type";
import { computed, defineComponent, onMounted, PropType, ref, unref } from "vue";
import Pair from "./Pair.vue";
import microdiff from "microdiff";
import { MaybeRef } from "@vueuse/core";

export interface Props {
}

interface PairTapMap extends TapMap {
    id: number;
}

export default defineComponent({
    name: "pair-list",

    components: {
        Pair,
        Multiselect,
        Autocomplete,
        ElButton
    }, // end components

    props: {
        list: {
            type: Array as PropType<TapMap[]>,
            default: () => []
        },
    }, // end props

    setup(props, { attrs, slots, emit }) {
        const { pairs, filterPairs, setOldParis, isDiff } = usePairs(props.list);

        function onAdd() {
            pairs.value = [...pairs.value, { ob: "", vika: "", id: uid++ }];
        };
        function onRemove(i: number) {
            pairs.value = pairs.value.filter((_, j) => i !== j);
        };

        function onChange([label, value]: [string, string]) {
            if (_.isEmpty(label) || _.isEmpty(value)) {
                return;
            }

            if (!isDiff()) {
                return;
            }

            setOldParis(pairs);
            emit("change", filterPairs.value);
        }

        const options = [
            'foo',
            'bar',
            'baz'
        ];

        const state1 = ref('');
        const state2 = ref('');

        const restaurants = ref<RestaurantItem[]>([]);
        const querySearch = (queryString: string, cb: any) => {
            const results = queryString
                ? restaurants.value.filter(createFilter(queryString))
                : restaurants.value;
            // call callback function to return suggestions
            cb(results);
        };
        const createFilter = (queryString: string) => {
            return (restaurant: RestaurantItem) => {
                return (
                    restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
                );
            };
        };
        const loadAll = () => {
            return [
                { value: 'vue', link: 'https://github.com/vuejs/vue' },
                { value: 'element', link: 'https://github.com/ElemeFE/element' },
                { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
                { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
                { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
                { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
                { value: 'babel', link: 'https://github.com/babel/babel' },
            ];
        };

        const handleSelect = (item: RestaurantItem) => {
            console.log(item);
        };

        onMounted(() => {
            restaurants.value = loadAll();
        });


        return {
            state1,
            querySearch,
            handleSelect,
            value: ref(""),
            options,
            getItems() {
                console.log(arguments);
            },
            pairs,
            onAdd,
            onRemove,
            onChange,
        };
    } // end setup
}); // end defineComponent

function usePairs(list: TapMap[]) {
    const oldPairs = ref<PairTapMap[]>(toPairTapMap(list));
    const filterOldPairs = computed(() => toTapMap(oldPairs));

    const pairs = ref<PairTapMap[]>(toPairTapMap(list));
    const filterPairs = computed(() => toTapMap(pairs));

    function isDiff() {
        return microdiff(filterOldPairs.value, filterPairs.value).length > 0;
    }

    return {
        pairs,
        filterPairs,
        oldPairs,
        setOldParis(list: MaybeRef<TapMap[] | PairTapMap[]>) {
            oldPairs.value = toPairTapMap(list);
        },
        filterOldPairs,
        isDiff,
    };
}

let uid = 0;
function toPairTapMap(pairs: MaybeRef<TapMap[] | PairTapMap[]>) {
    return unref(pairs).map((pair) => ({
        id: (pair as PairTapMap).id ?? uid++,
        ob: pair.ob,
        vika: pair.vika
    }));
}

function toTapMap(pairs: MaybeRef<PairTapMap[]>) {
    return unref(pairs)
        .filter(pair =>
            !_.isEmpty(pair.ob) && !_.isEmpty(pair.vika))
        .map(pair => ({
            ob: pair.ob,
            vika: pair.vika
        }));
}

</script>

<style lang="scss">
.vika-pair-list {
    .vika-pair-list--p-0 {
        padding: 0;
    }

    &--ctrls {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
