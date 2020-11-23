Meteor.publish('jmdk_division', function(terms) {
  var parameters = JMDK_QueryConstructor(terms); if(!parameters){ return null; }
  var list = JMDK_Division.find(parameters.find, parameters.options);
  return list;
});

Meteor.startup(function () { 
    JMDK_Division.rawCollection().createIndex({organization_id: 1}); 
    JMDK_Division.rawCollection().createIndex({page: 1, organization_id: 1, parentDivision_id: 1}); 
});
  
JMDK_QueryConstructor = function (terms) {
    if(!terms){ return false; }
  
    var viewFunction = JMDK_views[terms.name];
    if(!viewFunction){ console.log('> QUERY Err: ' + JSON.stringify(terms)); return false; }
  
    if(!terms.limit){ terms.limit = 1117; }
    var parameters = viewFunction(terms);
  
    if(!parameters){ return false; }
  
    return parameters;
};
  
JMDK_views = {};
  
termsJMDK_Division = { name: 'termsJMDK_Division' };
JMDK_views.termsJMDK_Division = function (terms) {
  if(!terms.page || !terms.organization_id){ return 'Invalid parameters.'; }

  var parameters = {
    find: {parentDivision_id: null},
    options: {sort: {position: 1}, limit: terms.limit}
  }; 

  if(terms.page){ parameters.find.page = terms.page; }
  if(terms.organization_id){ parameters.find.organization_id = terms.organization_id; }
  if(terms.parentDivision_id){ parameters.find.parentDivision_id = terms.parentDivision_id; }

  return parameters;
};