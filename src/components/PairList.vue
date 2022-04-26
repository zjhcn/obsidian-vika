<template>
    <div class="vika-pair-list">
        <div class="setting-item"> </div>
        <div class="setting-item">
            <Pair>
                <template #suffix>
                    <button v-icon="'cross'" @click="$emit('remove')"></button>
                </template>
            </Pair>
        </div>
        <div class="setting-item">
            <Pair>
                <template #suffix>
                    <button v-icon="'cross'" @click="$emit('remove')"></button>
                </template>
            </Pair>
        </div>
        <div class="setting-item">
            <Pair>
                <template #suffix>
                    <button v-icon="'cross'" @click="$emit('remove')"></button>
                </template>
            </Pair>
        </div>
        <div class="setting-item">
            <Pair>
                <template #suffix>
                    <button v-icon="'cross'" @click="$emit('remove')"></button>
                </template>
            </Pair>
        </div>
        <div class="setting-item"> </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Pair from "./Pair.vue";

export interface Props {
}

export default defineComponent({
    name: "pair-list",

    components: {
        Pair
    }, // end components

    props: {
    }, // end props

    setup(props, { attrs, slots, emit }) {

        return {};
    } // end setup
}); // end defineComponent

</script>

<style lang="scss">
.vika-pair-list {
    .setting-item {
        padding: 0;
    }
}
</style>
