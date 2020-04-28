export function getVueTemplate(name : String): String{

    return`<template lang="html" src="./${name}.component.html"></template>
<script lang="ts" src="./${name}.component.ts"></script>
<style scoped lang="scss" src="./${name}.component.scss"></style>`;

}