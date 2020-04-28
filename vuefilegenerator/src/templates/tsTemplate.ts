export function getTsTemplate(name : String){

    return `import Vue from 'vue';

export default Vue.extend({
    name: "${name}Component"				
});`;

}