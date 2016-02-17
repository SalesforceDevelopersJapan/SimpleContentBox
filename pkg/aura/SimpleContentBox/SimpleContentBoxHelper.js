({
    getSimpleContent : function(component) {
        // Apex
        var action = component.get("c.getSimpleContent");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(data) {
            component.set("v.content", data.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})