if(Meteor.isClient){ 
  Session.set('lastRoute',null);
  Router.plugin('reywood:iron-router-ga'); 
}

Router.configure({ 
  trackPageView: true,
  layoutTemplate: 'interface'
});

//--------------------------------------------------------------------//

disconnectVoids = [];

routeForNoLoading = [];

//--------------------------------------------------------------------//

var routeChangeCount = 0;

Router.onBeforeAction(function () {
  var route = Router.current().route.getName(); 
  var params = Router.current().params; 

  if(Session.get('lastRoute') !== route || (params && params.organization_id && params.organization_id !== Session.get('lastParams_organization_id'))){
    $("#content").scrollTo(0,0); 
    window.scrollTo(0,0);
  }

  routeChangeCount++;
  this.next();
});

//--------------------------------------------------------------------//

Router.onAfterAction(function () { 
  var route = Router.current().route.getName(); 
  var params = Router.current().params; 

  if(Session.get('lastRoute') !== route || (params && _.isEqual(params,Session.get('lastParams')))){
    $("#content").scrollTo(0,0); 
    window.scrollTo(0,0);
  }
  
  Session.set('lastRoute',route);
  if(params){ Session.set('lastParams',params); }
  else { Session.set('lastParams',null); }
});

//--------------------------------------------------------------------//

Router.map(function() {  

  this.route('JMDKIT', { path: '/', });

});