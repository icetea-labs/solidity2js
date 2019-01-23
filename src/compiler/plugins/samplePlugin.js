export default {
    ContractDefinition: function(node) {
        console.log(node);
        //if (node.name === "SampleStore") {
            node.name = "NameChangedByPlugin";
        //}
    }
}