global with sharing class SimpleContentBoxController {
    @AuraEnabled
    global static SimpleContent__c getSimpleContent(String recordId){
        System.debug('*** SimpleContentBoxController.getSimpleContent() *** Start');
        List<SimpleContent__c> content = [Select Id, Name, ContentDispNone__c, ContentDispAll__c, ContentDispLeft__c, ContentDispRight__c, ContentLeft__c, ContentLeftDisp__c, ContentRight__c, ContentRightDisp__c from SimpleContent__c Where Id = :recordId];
        if (content.size() != 1) {
            return new SimpleContent__c();
        }
        System.debug('*** SimpleContentBoxController.getSimpleContent() *** content :' + content);
        return content[0];
    }
}