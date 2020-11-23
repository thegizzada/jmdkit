JMDK_totalSub = 0;
JMDK_pendingSub = 0;

Session.set('SubToJMDKDivisionList',[]);

Template.JamakerDevelopmentKit.onCreated(function () {

    var JMDK = this.data;
    var instance = this;

    Session.set('JMDK_pendingSub',1); Session.set('JMDK_pendingSubPeak',2); Session.set('JMDK_pendingSubCreep',0);
    var pendingSubIncrement = 0;
  
    instance.autorun(function () {
        
        var route = Router.current().route.getName(); 

        var termsJMDK_Division = { user_id: Meteor.userId(), name: 'termsJMDK_Division', page: JMDK.page, organization_id: JMDK.organization_id };
        var subTo_JMDK_Division = instance.subscribe('jmdk_division',termsJMDK_Division);
        if(subTo_JMDK_Division.ready()) { if(pendingSubIncrement){ JMDK_pendingSub-=pendingSubIncrement; } pendingSubIncrement=0; } 
        else { if(!pendingSubIncrement){ JMDK_totalSub++; JMDK_pendingSub++; } pendingSubIncrement=1; }

        /*if(!Session.get('JMDK_pendingSubPeak') || Session.get('JMDK_pendingSubPeak') < JMDK_pendingSub){ Session.set('JMDK_pendingSubPeak',JMDK_pendingSub); }
        if(!JMDK_pendingSub){ Meteor.setTimeout(function(){ Session.set('JMDK_pendingSubPeak',0); }, 1017); }
        if(routeForNoLoading.indexOf(route) === -1){ Session.set('JMDK_pendingSub',JMDK_pendingSub); }
        else { Session.set('JMDK_pendingSub',0); }*/

        Session.set('calculateContentSize',true);

        if(Session.get('JMDK_pendingSubCreep') >= 100){ Session.set('JMDK_pendingSub',0); }

    });

});

Template.JMDK_division.onCreated(function () {

    var division = this.data;
    var instance = this;

    var pendingSubIncrement = 0;
  
    instance.autorun(function () {
        
        var route = Router.current().route.getName(); 

        var termsJMDK_Division = { user_id: Meteor.userId(), name: 'termsJMDK_Division', page: division.page, organization_id: division.organization_id, parentDivision_id: division._id };
        var subTo_JMDK_Division = instance.subscribe('jmdk_division',termsJMDK_Division);
        if(subTo_JMDK_Division.ready()) { SubToJMDKDivision(division._id,true); if(pendingSubIncrement){ JMDK_pendingSub-=pendingSubIncrement; } pendingSubIncrement=0; } 
        else { SubToJMDKDivision(division._id,false); if(!pendingSubIncrement){ JMDK_totalSub++; JMDK_pendingSub+=1; } pendingSubIncrement=1; }

        /*if(!Session.get('JMDK_pendingSubPeak') || Session.get('JMDK_pendingSubPeak') < JMDK_pendingSub){ Session.set('JMDK_pendingSubPeak',JMDK_pendingSub); }
        if(!JMDK_pendingSub){ Meteor.setTimeout(function(){ Session.set('JMDK_pendingSubPeak',0); }, 1017); }
        if(routeForNoLoading.indexOf(route) === -1){ Session.set('JMDK_pendingSub',JMDK_pendingSub); }
        else { Session.set('JMDK_pendingSub',0); }*/

        Session.set('calculateContentSize',true);

    });

});

SubToJMDKDivision = function(division_id,readyOrNot) { 
    var SubToJMDKDivisionList = Session.get('SubToJMDKDivisionList');
    if(!SubToJMDKDivisionList){ SubToJMDKDivisionList = []; }
    if(readyOrNot){ SubToJMDKDivisionList = _.union(SubToJMDKDivisionList,[division_id]); }
    else { SubToJMDKDivisionList = _.difference(SubToJMDKDivisionList,[division_id]); }
    Session.set('SubToJMDKDivisionList',SubToJMDKDivisionList);
}

LoadJMDKSubDivisionList = function(list,division) { 
    if(!list || !list.length){ return []; }
    var loadedList = []; var index = 0;
    list.forEach(function(subDivision){ index++;
        var renderDivision = false;

        if(!division){ 
            if(index === 1){ 
                renderDivision = true; 
            } else {
                var ParentDivisionChildrenList = list[index-2].divisionChildrenList;
                var SubToJMDKDivisionList = Session.get('SubToJMDKDivisionList');
                if(_.difference(ParentDivisionChildrenList,SubToJMDKDivisionList).length <= 2){
                    renderDivision = true; 
                }
            }
        } else {
            if(division.position === 1){
                renderDivision = true; 
            } else {
                var previousDivision = JMDK_Division.findOne({parentDivision_id: division.parentDivision_id, position: division.position-1});
                if(previousDivision){
                    var ParentDivisionChildrenList = previousDivision.divisionChildrenList;
                    var SubToJMDKDivisionList = Session.get('SubToJMDKDivisionList');
                    if(_.difference(ParentDivisionChildrenList,SubToJMDKDivisionList).length <= 2){
                        renderDivision = true;
                    }
                }
            }
        }

        if(renderDivision){ loadedList.push(subDivision); }
    }); return loadedList;
}