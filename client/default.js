document.addEventListener('resume', function () {
  Meteor.setTimeout(function () {
    Session.set('calculateContentSize',true);
  }, 0);
}, false);

window.addEventListener('keyboardWillHide', () => {
  window.scrollTo(0,0);
  document.body.scrollTop = 0;
  Session.set('calculateContentSize',true);
});

Session.set('calculateContentSize',true);
Session.set('contentwidth',null);
Session.set('contentheight',null);

resetVariables = function() {
    Session.set('clientVersion','1.8.9');
    Session.set('calculateContentSize',true);
}

Meta.config({ options: { title: "•", suffix: "•" } }); 

Template.default.onCreated(function () {

  if(window.StatusBar) { StatusBar.styleBlackTranslucent(); } 
  resetVariables();

});

Template.default.helpers({

    measureInterface: function () {
        var check = Session.get('calculateContentSize');
        if(check){ calculateContentSize(); }
        else { return false; }
    },

    JMDK_pendingSubOpacity: function () {
      var JMDK_pendingSub = Session.get('JMDK_pendingSub');
      if(JMDK_pendingSub){ return 1; }
      else { return 0; }
    },
    JMDK_pendingSubPointer: function () {
      var JMDK_pendingSub = Session.get('JMDK_pendingSub');
      if(JMDK_pendingSub){ return 'auto'; }
      else { return 'none'; }
    },
    JMDK_pendingSubProgress: function () {
      var JMDK_pendingSub = Session.get('JMDK_pendingSub');
      var JMDK_pendingSubPeak = Session.get('JMDK_pendingSubPeak');
      var JMDK_pendingSubCreep = Session.get('JMDK_pendingSubCreep') || 0;
  
      if(JMDK_pendingSub){
        Meteor.setTimeout(function(){ 
          JMDK_pendingSubCreep+=3; 
          Session.set('JMDK_pendingSubCreep',JMDK_pendingSubCreep); 
        },100);
      } else {
        Session.set('JMDK_pendingSubCreep',0);
      }
      
      var progress = Math.round((JMDK_pendingSubPeak-JMDK_pendingSub)/JMDK_pendingSubPeak*100);
      if(progress < 10){ progress = 10; }
      progress = progress + JMDK_pendingSubCreep;
      if(progress > 100){ progress = 100; }
      if(!JMDK_pendingSubPeak && !JMDK_pendingSub){ progress = 100; }
      if(!JMDK_pendingSub){ progress = 100; }
      if(!JMDK_pendingSubPeak){ progress = 0; }
      
      return progress + '%';
    },

});

$(function() { $(window).resize(function() { calculateContentSize(); }); });

calculateContentSize = function() {
  Session.set('calculateContentSize',false);

  var route = Router.current().route.getName();

  var measurementDiv = "#measureInterface";
    
  var contentWidth = parseInt($(measurementDiv).css('width'));
  Session.set('contentWidth',contentWidth);

  var contentHeight = parseInt($(measurementDiv).css('height'));
  Session.set('contentHeight',contentHeight);

  if(contentWidth > 767){ 
    if(!Session.get('deviceClass') || Session.get('deviceClass') === 'mobile'){ 
      Session.set('deviceClass','computer'); 
    }   
  } else {
    if(contentWidth && Meteor.userId() && !Session.get('deviceClass') && route !== 'TeleconferenceVisitor'){
      Session.set('openRightUI',true);
    }
    if(!Session.get('deviceClass') || Session.get('deviceClass') === 'computer'){ 
      Session.set('deviceClass','mobile'); 
    }
  }

  if(Meteor.isCordova){ Session.set('deviceClass','mobile'); }
}

Template.interface.onRendered(function () {
  
  Session.set('calculateContentSize',true);

});

Template.JMDKIT.helpers({

  JMDK: function () {
    return { page: 'home', organization_id: 'JkgiCkPHzzqy4zjDj' };
  },

});