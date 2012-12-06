var Pirika = {

  init: function(){
    console.log('init');

    this.map = new google.maps.Map($('#map')[0], {
      zoom: 15, center: this.defaultCenter, mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    google.maps.event.addListener(this.map, 'idle', this.onIdle);
  },

  map: undefined,
  markers: [],
  lastRequest: undefined,

  defaultCenter: new google.maps.LatLng(35.681382, 139.766084),

  onIdle: function() {
    console.log('idle');
    var $d = Pirika.getPirikas(Pirika.map.getBounds());
    $d.success(function(data) { console.log(data); });
  },

  getPirikas: function(bounds) {
    var requestTime = (new Date()).getTime();
    this.lastRequest = requestTime;

    return $.getJSON('/api', {
      request: requestTime,
      latNE  : bounds.getNorthEast().lat(),
      lonNE  : bounds.getNorthEast().lng(),
      latSW  : bounds.getSouthWest().lat(),
      lonSW  : bounds.getSouthWest().lng()
    });
  }

};


$(function() {
  Pirika.init();
});
