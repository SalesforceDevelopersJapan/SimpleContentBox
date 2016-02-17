@isTest
private class SimpleContentBoxControllerTest {
	static testMethod void test_getSimpleContent() {
        SimpleContent__c c1 = new SimpleContent__c(Name = 'Simple Content', ContentLeft__c = 'A Content',  ContentRight__c = 'B Content');
        insert c1;
        
        c1 = [Select Id, Name, ContentLeft__c, ContentRight__c From SimpleContent__c where Id = :c1.Id];
        
        SimpleContent__c c2 = SimpleContentBoxController.getSimpleContent('XXXX');
        
        System.assert(String.isEmpty(c2.Name));

        c2 = SimpleContentBoxController.getSimpleContent(c1.Id);
        
        System.assert(c2 != null);
    }
}