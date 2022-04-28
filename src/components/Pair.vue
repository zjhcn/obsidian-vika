<template>
    <div class="vika-pair">
        <div class="vika-pair--field">
            <label>
                {{ labelLabel }}
                <input type="text" v-model="label" @change.stop="onChange" />
            </label>
            <label class="vika-pair--field--value-label">
                {{ valueLabel }}
                <input type="text" v-model="value" @change.stop="onChange" />
            </label>
        </div>
        <div class="vika-pair-suffix">
            <slot name="suffix"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useVModel } from "@vueuse/core";

export interface Props {
}

export default defineComponent({
    name: "pair",

    emits: ["change", "update:label", "update:value"],

    props: {
        label: {
            type: String,
            default: "",
        },
        value: {
            type: String,
            default: "",
        },
        labelLabel: {
            type: String,
            default: "Label"
        },
        valueLabel: {
            type: String,
            default: "Value"
        }
    }, // end props

    setup(props, { attrs, slots, emit }) {
        const label = useVModel(props, 'label', emit);
        const value = useVModel(props, 'value', emit);

        function onChange() {
            emit('change', [label.value, value.value]);
        }

        return {
            label,
            value,
            onChange
        };
    } // end setup
}); // end defineComponent

</script>

<style lang="scss">
.vika-pair {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &--field {
        &--value-label {
            margin-left: 1em;
        }
    }

    &--suffix {
        text-align: right;
    }
}
</style>
