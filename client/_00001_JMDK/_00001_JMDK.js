Template.JamakerDevelopmentKit.helpers({

    JMDKDivisionList: function () {
        var JMDK = this;
        return LoadJMDKSubDivisionList(JMDK_Division.find({page: JMDK.page, organization_id: JMDK.organization_id, parentDivision_id: null},{sort: {position: 1, dateCreate: 1}}).fetch(),null);
    },

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

Template.JMDK_division.helpers({

    JMDKis_box: function () { return JMDKis(this,'box'); },
    JMDKis_columns: function () { return JMDKis(this,'columns'); },
    JMDKis_slideshow: function () { return JMDKis(this,'slideshow'); },
    JMDKis_text: function () { return JMDKis(this,'text'); },
    JMDKis_image: function () { return JMDKis(this,'image'); },
    JMDKis_button: function () { return JMDKis(this,'button'); },

});

Template.JMDK_box.helpers({

    JMDK_showTemplatePlugin: function () { return 'fade'; },
    JMDK_showTemplate: function () { return JMDK_showTemplate('division',this._id); },

    JMDKSubDivisionList: function () {
        var division = this;
        return LoadJMDKSubDivisionList(JMDK_Division.find({page: division.page, organization_id: division.organization_id, parentDivision_id: division._id},{sort: {position: 1, dateCreate: 1}}).fetch(),division);
    },

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

Template.JMDK_columns.helpers({

    JMDK_showTemplatePlugin: function () { return 'fade'; },
    JMDK_showTemplate: function () { return JMDK_showTemplate('division',this._id); },

    JMDKSubDivisionList: function () {
        var division = this;
        return LoadJMDKSubDivisionList(JMDK_Division.find({page: division.page, organization_id: division.organization_id, parentDivision_id: division._id},{sort: {position: 1, dateCreate: 1}}).fetch(),division);
    },

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

    columnCount: function () {
        var division = this;
        if(division.columnCount <= 1){ return 'one'; }
        if(division.columnCount === 2){ return 'two'; }
        if(division.columnCount === 3){ return 'three'; }
        if(division.columnCount === 4){ return 'four'; }
        if(division.columnCount === 5){ return 'five'; }
        if(division.columnCount === 6){ return 'six'; }
        if(division.columnCount === 7){ return 'seven'; }
    },

});

Template.JMDK_slideshow.helpers({

    JMDKSubDivisionList: function () {
        var division = this;
        return LoadJMDKSubDivisionList(JMDK_Division.find({page: division.page, organization_id: division.organization_id, parentDivision_id: division._id},{sort: {position: 1, dateCreate: 1}}).fetch(),division);
    },

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

Template.JMDK_text.helpers({

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

Template.JMDK_image.helpers({

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

Template.JMDK_button.helpers({

    CSS: function () {
        var stringCSS = ''; if(this.CSS && this.CSS.length){ this.CSS.forEach(function(parameter){ if(!stringCSS){ stringCSS = parameter } else { stringCSS = stringCSS + '; ' + parameter; } }); } return stringCSS;
    },

});

JMDK_showThumbnailInstance = {};
JMDK_showThumbnailCount = {};

JMDK_showTemplate = function (key,this_id) {
  var instance = JMDK_showThumbnailInstance[key];
  if(!JMDK_showThumbnailCount[key]){ JMDK_showThumbnailCount[key] = 0; }
  if(!Session.get(key+'preJMDK_showThumbnail')){ Session.set(key+'preJMDK_showThumbnail',{}); }
  var preJMDK_showThumbnail = Session.get(key+'preJMDK_showThumbnail');
  if(!Session.get(key+'JMDK_showThumbnail')){ Session.set(key+'JMDK_showThumbnail',{}); }
  var JMDK_showThumbnail = Session.get(key+'JMDK_showThumbnail');
  if(JMDK_showThumbnail){
    if(!JMDK_showThumbnail[this_id]){
      if(!preJMDK_showThumbnail[this_id]){
        JMDK_showThumbnailCount[key]++;
        preJMDK_showThumbnail[this_id] = true;
        Session.set(key+'preJMDK_showThumbnail',preJMDK_showThumbnail);
      }
      Meteor.setTimeout(function() { if(instance === JMDK_showThumbnailInstance[key]){ 
        JMDK_showThumbnail = Session.get(key+'JMDK_showThumbnail');
        JMDK_showThumbnail[this_id] = true;
        Session.set(key+'JMDK_showThumbnail',JMDK_showThumbnail);
      } }, 1.7+((JMDK_showThumbnailCount[key]-1)*117));
      return false;
    } else {
      Meteor.setTimeout(function() { if(instance === JMDK_showThumbnailInstance[key]){ 
        if(JMDK_showThumbnailCount[key] > -1){
          JMDK_showThumbnailCount[key]--; 
          Session.set(key+'JMDK_showThumbnailCount',JMDK_showThumbnailCount[key]);
        }
      } }, 1.7+((JMDK_showThumbnailCount[key]-1)*117));
      return true;
    }
  }
}