global with sharing class SimpleContentBoxController {
    @AuraEnabled
    global static SimpleContent__c getSimpleContent(String recordId){
        System.debug('*** SimpleContentBoxController.getSimpleContent() *** Start');
        List<SimpleContent__c> content = [Select Id, Name, SMPCNT__ContentDispNone__c, SMPCNT__ContentDispAll__c, SMPCNT__ContentDispLeft__c, SMPCNT__ContentDispRight__c, SMPCNT__ContentLeft__c, SMPCNT__ContentLeftDisp__c, SMPCNT__ContentRight__c, SMPCNT__ContentRightDisp__c from SMPCNT__SimpleContent__c Where Id = :recordId];
        if (content.size() != 1) {
            return new SimpleContent__c();
        }
        System.debug('*** SimpleContentBoxController.getSimpleContent() *** content :' + content);
        return content[0];
    }
}