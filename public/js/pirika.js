var Pirika = {

  init: function(){
    console.log('init');
    this.map = new google.maps.Map($('#map')[0], {
      zoom: 17, center: this.defaultCenter, mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    google.maps.event.addListener(this.map, 'idle', this.updatePirika);
  },

  map: undefined,
  markers: [],
  lastRequest: undefined,

  defaultCenter: new google.maps.LatLng(35.681382, 139.766084), // tokyo station

  updatePirika: function() {
    console.log('idle');
    var $data = Pirika.getPirikas(Pirika.map.getBounds());
    $data.success(function(res) {
      console.log(res.size);
      Pirika.removeMarkers();
      if (Pirika.lastRequest == res.request) {
        for (var i = 0; i < res.size; i++) {
          Pirika.markers.push(Pirika.makeMaker(res.data[i]));
        }
        Pirika.putMarkers();
      }
    });
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
  },

  makeMaker: function(data) {
    var marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      position: new google.maps.LatLng(data.lat, data.lng)
    });
    return marker;
  },

  putMarkers: function() {
    // TODO use setTimeout
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
    }
  },

  removeMarkers: function() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  },

};


$(function() {
  Pirika.init();
});
