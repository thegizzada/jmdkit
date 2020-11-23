Meteor.methods({
  
    newJMDKDivision: function(parameters) { if(Meteor.isServer){
      
        var newJMDKDivision = {
            dateCreate: moment().valueOf(),
        };

        if(parameters.page){ newJMDKDivision.page = parameters.page; }
        if(parameters.organization_id){ newJMDKDivision.organization_id = parameters.organization_id; }
        if(parameters.parentDivision_id){ newJMDKDivision.parentDivision_id = parameters.parentDivision_id; }
    
        var division_id = JMDK_Division.insert(newJMDKDivision);
        Meteor.call('updateJMDKDivisionInformation',division_id,parameters);
        return { division_id: division_id, title: 'Success', text: 'Division has been created.', icon: 'success' };

    } },
    
    deleteJMDKDivision: function(division_id) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record.', icon: 'error' }; }

        JMDK_Division.remove(division._id);
            
        JMDK_Division.find({page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: {$gt: division.position}}).fetch().forEach(function(shiftDivision){
            shiftDivision.position = shiftDivision.position-1;
            Meteor.call('updateJMDKDivision',shiftDivision);
        });
        
        JMDK_Division.find({parentDivision_id: division._id}).fetch().forEach(function(subDivision){
            Meteor.call('deleteJMDKDivision',subDivision._id);
        });
    
        return { title: 'Success', text: 'Division has been deleted.', icon: 'success' };

    } },
    
    duplicateJMDKDivision: function(division_id,parentDivision_id,parameters) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record.', icon: 'error' }; }

        var duplicateDivision = JSON.parse(JSON.stringify(division));
        delete duplicateDivision._id; 
        duplicateDivision.parentDivision_id = parentDivision_id || null;
        var duplicateDivision_id = JMDK_Division.insert(duplicateDivision);
        
        JMDK_Division.find({parentDivision_id: division._id}).fetch().forEach(function(subDivision){
            Meteor.call('duplicateJMDKDivision',subDivision._id,duplicateDivision_id,{skipPushDown:true});
        });
        
        if(!parameters || !parameters.skipPushDown){ Meteor.call('pushPositionDownJMDKDivision',division_id); }

        return { division_id: division_id, title: 'Success', text: 'Division has been duplicated.', icon: 'success' };

    } },
    
    moveJMDKDivision: function(division_id,overDivision_id,position) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record. [001]', icon: 'error' }; }
  
        var overDivision = JMDK_Division.findOne(overDivision_id);
        if(!overDivision){ return { title: 'Error', text: 'Unable to locate record. [002]', icon: 'error' }; }

        //console.log('from',division.position,'to',position);

        if(division_id === overDivision_id){ return { title: 'Success', text: 'Division has been moved. [001]', icon: 'success' }; }
        if(division.parentDivision_id === overDivision.parentDivision_id && division.position === position){ return { title: 'Success', text: 'Division has been moved. [002]', icon: 'success' }; }

        if(position === -1){
            JMDK_Division.find({_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: {$gt: division.position}}).fetch().forEach(function(moveDivision){
                moveDivision.position = moveDivision.position-1;
                Meteor.call('updateJMDKDivision',moveDivision);
            });

            JMDK_Division.find({_id: {$ne: division._id}, page: overDivision.page, organization_id: overDivision.organization_id, parentDivision_id: overDivision._id || null, position: {$gte: position}}).fetch().forEach(function(moveDivision){
                moveDivision.position = moveDivision.position+1;
                Meteor.call('updateJMDKDivision',moveDivision);
            });

            division.parentDivision_id = overDivision._id;

            if(position < 1){ division.position = 1; 
            } else { division.position = overDivision.position; }
        } else {
            JMDK_Division.find({_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: {$gt: division.position}}).fetch().forEach(function(moveDivision){
                moveDivision.position = moveDivision.position-1;
                Meteor.call('updateJMDKDivision',moveDivision);
            });

            if(division.parentDivision_id !== overDivision.parentDivision_id){
                JMDK_Division.find({_id: {$ne: division._id}, page: overDivision.page, organization_id: overDivision.organization_id, parentDivision_id: overDivision.parentDivision_id || null, position: {$gte: position}}).fetch().forEach(function(moveDivision){
                    moveDivision.position = moveDivision.position+1;
                    Meteor.call('updateJMDKDivision',moveDivision);
                });
    
                division.parentDivision_id = overDivision.parentDivision_id;

                division.position = position;
            } else {
                JMDK_Division.find({_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: {$gte: overDivision.position}}).fetch().forEach(function(moveDivision){
                    moveDivision.position = moveDivision.position+1;
                    Meteor.call('updateJMDKDivision',moveDivision);
                });

                if(position < 1){ division.position = 1; 
                } else { division.position = overDivision.position; }
            }
        }

        Meteor.call('updateJMDKDivision',division);

        return { title: 'Success', text: 'Division has been moved. [003]', icon: 'success' };

    } },
    
    pushPositionUpJMDKDivision: function(division_id) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record.', icon: 'error' }; }
          
        if(division.position === 1){ return { title: 'Alert', text: 'Division is already at top.', icon: 'warning' }; }
        
        division.position = division.position-1;
        Meteor.call('updateJMDKDivision',division);

        var upDivision = JMDK_Division.findOne({_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: division.position});
        if(upDivision){ Meteor.call('pushPositionUpJMDKDivision',upDivision._id); }

        return { title: 'Success', text: 'Division has been moved.', icon: 'success' };

    } },
    
    pushPositionDownJMDKDivision: function(division_id) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record.', icon: 'error' }; }
          
        division.position = division.position+1;
        Meteor.call('updateJMDKDivision',division);

        var downDivision = JMDK_Division.findOne({_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null, position: division.position});
        if(downDivision){ Meteor.call('pushPositionDownJMDKDivision',downDivision._id); }

        return { title: 'Success', text: 'Division has been moved.', icon: 'success' };

    } },
    
    updateJMDKDivision: function(division) { if(Meteor.isServer){ 
  
        if(!division.position){ 
            division.position = JMDK_Division.find( {_id: {$ne: division._id}, page: division.page, organization_id: division.organization_id, parentDivision_id: division.parentDivision_id || null} ).count()+1; 
            if(!division.divisionId){ division.divisionId = division.type + '_' + division.position; }
        }
            
        division.dateUpdate = moment().valueOf();
        JMDK_Division.update(division._id,division);
    
        //JMDK_DivisionArchive.insert(PrepareRecordArchive(division));
        
        return { title: 'Success', text: 'Division has been updated.', icon: 'success' };

    } }, 

    updateJMDKDivisionInformation: function(division_id,information) { if(Meteor.isServer){ 
  
        var division = JMDK_Division.findOne(division_id);
        if(!division){ return { title: 'Error', text: 'Unable to locate record.', icon: 'error' }; }

        division.position = Number(information.position);

        division.divisionId = information.divisionId;
        division.columnCount = information.columnCount;

        division.HTML = information.HTML;
        division.CSS = information.CSS;
        
        division.type = information.type;
        
        Meteor.call('updateJMDKDivision',division);
        return { title: 'Success', text: 'Division has been updated.', icon: 'success' };

    } },
  
});