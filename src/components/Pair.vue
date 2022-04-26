<template>
    <div class="vika-pair">
        <div class="vika-pair--field">
            <label>
                {{ labelLabel }}
                <input type="text" v-model="label" @change.stop />
            </label>
            <label class="vika-pair--field--value-label">
                {{ valueLabel }}
                <input type="text" v-model="value" @change.stop />
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

        return {
            label,
            value
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
