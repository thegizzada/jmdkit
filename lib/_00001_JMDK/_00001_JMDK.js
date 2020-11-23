JMDKis = function(division,type) { 
    if(division.type === type){ return true; }
    if(type === 'container' && ['box','column','slideshow'].indexOf(division.type) !== -1){ return true; }
    return false; 
}

GetDivisionParent = function(division_id) { 
    var division = JMDK_Division.findOne(division_id);
    if(division && division.parentDivision_id){
        return JMDK_Division.findOne(division.parentDivision_id);
    } else { return false; }
}

GetAllDivisionParents = function(division_id) { 
    var list = [division_id];
    var division = JMDK_Division.findOne(division_id);
    if(division && division.parentDivision_id){
        list = _.union(list,GetAllDivisionParents(division.parentDivision_id));
    } return list;
}

GetAllDivisionChildren = function(division_id) { 
    var list = [division_id];
    var division = JMDK_Division.findOne(division_id);
    JMDK_Division.find({parentDivision_id: division._id}).fetch().forEach(function(childDivision){
        list = _.union(list,GetAllDivisionChildren(childDivision._id));
    }); return list;
}