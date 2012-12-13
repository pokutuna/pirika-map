var Pirika = {

  init: function(){
    console.log('init');
    this.map = new google.maps.Map($('#map')[0], {
      zoom: 15, center: this.defaultCenter, mapTypeId: google.maps.MapTypeId.SATELLITE
    });
    google.maps.event.addListener(this.map, 'idle', this.update);
  },

  map: undefined,
  markers: {}, // put flag
  lastRequest: undefined,
  putTimer: undefined,

  defaultCenter: new google.maps.LatLng(35.661214, 139.719521),

  update: function() {
    // Pirika.removeMarkers();
    var $data = Pirika.getPirikasApi(Pirika.map.getBounds());
    $data.success(Pirika.handleApiResult);
  },

  handleApiResult: function(res) {
    console.log(res.size);
    if (Pirika.lastRequest == res.request) {
      if (res.hasNext) Pirika.getPirikasApi(Pirika.map.getBounds(), res.page + 1).success(Pirika.handleApiResult);
      Pirika.putMarkers(res.data);
    }
  },

  getPirikasApi: function(bounds, page) {
    if (!page) page = 0;
    var requestTime = (new Date()).getTime();
    this.lastRequest = requestTime;

    return $.getJSON('/api', {
      request: requestTime,
      page   : page,
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
      // animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(data.lat, data.lng),
      icon: {
        strokeColor: 'white',
        path: google.maps.SymbolPath.CIRCLE,
        scale: 1
      }
    });
    return marker;
  },

  putMarkers: function(data) {
    var i = 0, size = data.length;
    Pirika.putTimer = true;
    setTimeout(function callback() {
      if (!Pirika.putTimer || !(i < size)) return;
      for (var j = 0; j < 5; j++) {
        if (!data[i]) break;
        if (!Pirika.markers[data[i].key]) {
          var marker = Pirika.makeMaker(data[i]);
          Pirika.markers[data[i].key] = true;
          marker.setMap(Pirika.map);
        }
        i++;
      }
      Pirika.putTimer = setTimeout(callback, 1);
    }, 1);
  },

  removeMarkers: function() {
    clearTimeout(Pirika.putTimer);
    Pirika.putTimer = false;
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  },

};


$(function() {
  Pirika.init();
});
