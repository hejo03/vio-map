/*
http://localhost:5500/?dev=true
TEST
*/
var ignoredTitles = ["GANG_NAME", "SQUAD_NAME"];
function search(text) {
  if (text == "") {
    $("#realTypes").show();
    $("#searchResults").html(``);
    return;
  }
  $("#realTypes").hide();
  var html = "";
  fetch("locations.json")
    .then((response) => response.json())
    .then((json) => {
      function filterItems(needle, heystack) {
        var query = needle.toLowerCase();
        return heystack.filter(function (item) {
          return (
            item.title.toLowerCase().indexOf(query) >= 0 &&
            !ignoredTitles.includes(item.title)
          );
        });
      }
      filterItems(text, json).forEach((loc) => {
        html += `<li data-id="${loc.id}"><label>${loc.title}</label></li>`;
      });
      $("#searchResults").html(`<ul>${html}</ul>`);
    });
}

$(function () {
  var showCoordinations = true;
  const urlParams = new URLSearchParams(window.location.search);

  const devMode = urlParams.get("dev");
  const mapType = urlParams.get("mapType");
  const markerRef = urlParams.get("marker");

  // if (window.location.protocol != 'http:') {
  // 	window.location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
  // }

  var $types = $(".types");

  var onResize = function () {
    $types.css({
      maxHeight:
        $(window).height() -
        parseInt($types.css("marginTop"), 10) -
        parseInt($types.css("marginBottom"), 10) -
        parseInt($("header").height()) +
        6,
    });
  };

  onResize();

  $(window).resize(onResize);

  // window.isTourMode = false;

  // if (window.location.hash == '#tour') {
  // 	$('body').addClass('tour');
  // 	window.isTourMode = true;
  // }
  // else {
  // 	$('body').removeClass('tour');
  // 	window.isTourMode = false;
  // 	// $('#map').css({position:'absolute'});
  // }

  // $(window).on('hashchange', function() {
  // 	if (window.location.hash == '#tour') {
  // 		$('body').addClass('tour');
  // 		$('#map').css({position:'relative'});
  // 		window.isTourMode = true;
  // 		var x = locations.findWhere({ type: 'Nuclear Waste' });
  // 		Vent.trigger('location:clicked', x, true);
  // 	}
  // 	else {
  // 		$('body').removeClass('tour');
  // 		$('#map').css({position:'absolute'});
  // 		window.isTourMode = false;
  // 	}
  // });

  var currentMarker;

  var assetsUrl = function () {
    return window.location.hostname == "localhost"
      ? ""
      : "https://map.hejo03.de/";
  };

  var isdevMode = function () {
    return devMode == "true" ? true : false;
  };

  Handlebars.registerHelper("assetsUrl", assetsUrl);
  Handlebars.registerHelper("devMode", isdevMode);

  var timestampToSeconds = function (stamp) {
    stamp = stamp.split(":");
    return parseInt(stamp[0], 10) * 60 + parseInt(stamp[1], 10);
  };

  Handlebars.registerHelper("timestampToSeconds", timestampToSeconds);

  var Vent = _.extend({}, Backbone.Events);

  var LocationModel = Backbone.Model.extend({
    initialize: function () {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.get("lat"), this.get("lng")),
        icon: {
          url: assetsUrl() + "icons/" + categories.getIcon(this.get("type")),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      _.bindAll(this, "markerClicked");
      google.maps.event.addListener(marker, "click", this.markerClicked);

      this.set({ marker: marker });
    },

    markerClicked: function () {
      Vent.trigger("location:clicked", this);
    },

    removeHighlight: function () {
      this.get("marker").setIcon({
        url: this.get("marker").getIcon().url,
        scaledSize: new google.maps.Size(22, 22),
      });
    },

    highlightMarker: function () {
      //   if (currentMarker == this) {
      // console.log("highlightMarker1");
      // Vent.trigger("location:clicked", this);
      //   } else {

      if (currentMarker) currentMarker.removeHighlight();
      mapView.closePopupLocation();
      currentMarker = this;
      this.get("marker").setIcon({
        url: this.get("marker").getIcon().url,
        scaledSize: new google.maps.Size(32, 32),
      });
      Vent.trigger("location:clicked", this);
      //   }
    },
  });
  var LocationsCollection = Backbone.Collection.extend({
    model: LocationModel,
    url: "locations.json",
  });

  var locations = (window.locations = new LocationsCollection());

  var CategoryModel = Backbone.Model.extend({});
  var CategoriesCollection = Backbone.Collection.extend({
    model: CategoryModel,

    getIcon: function (type) {
      var o = this.findWhere({ name: type });
      if (o) {
        return o.get("icon");
      }

      return assetsUrl() + (o ? o.get("icon") : "blank.png");
    },

    forView: function (type) {
      var g = this.groupBy("type");
      return _(g).map(function (categories, type) {
        return {
          name: type,
          types: _.map(categories, function (category) {
            return category.toJSON();
          }),
        };
      });
    },
  });

  var categories = (window.cats = new CategoriesCollection([
    {
      name: "WT Spots",
      icon: "General/Packet.webp",
      type: "Blips",
      enabled: true,
    },
    {
      name: "DT Abgaben",
      icon: "General/Weed.webp",
      type: "Blips",
      enabled: true,
    },
    {
      name: "A. Helikopter",
      icon: "General/heli.webp",
      type: "Blips",
      enabled: true,
    },
    {
      name: "Gang Dealer",
      icon: "General/drug.webp",
      type: "Blips",
      enabled: true,
    },
    {
      name: "Händler",
      icon: "General/farm.webp",
      type: "Unternehmen",
      enabled: true,
    },
  ]));

  var CategoriesView = Backbone.View.extend({
    initialize: function () {
      this.template = Handlebars.compile($("#categoriesTemplate").html());
    },

    render: function () {
      this.$el.html(
        this.template({
          categories: categories.forView(),
        })
      );
      $("#typeDetails").hide();
      return this;
    },

    events: {
      "change input": "toggleLocations",
      "click .details": "showDetails",
    },

    toggleLocations: function (e) {
      var $e = $(e.currentTarget),
        type = $e.val(),
        showLocations = $e.is(":checked"),
        models = locations.where({ type: type });

      if (showLocations) {
        Vent.trigger("locations:visible", models);
      } else {
        Vent.trigger("locations:invisible", models);
      }
    },

    showDetails: function (e) {
      e.preventDefault();
      var typeName = $(e.currentTarget).data("name");
      this.$el
        .find('input[value="' + typeName + '"]')
        .prop("checked", true)
        .trigger("change");

      var type = categories.findWhere({ name: typeName });

      var details = new CategoryDetailsView({
        el: "#typeDetails",
        type: type,
      });
      details.render();
    },
  });

  var CategoryDetailsView = Backbone.View.extend({
    initialize: function () {
      this.template = Handlebars.compile($("#categoryDetailsTemplate").html());
    },

    events: {
      "click a.back": "goBack",
      "click li": "showMarker",
    },

    goBack: function (e) {
      e.preventDefault();
      this.$el.empty();
      this.off();
      $("#types").show();
    },

    showMarker: function (e) {
      var location = locations.get($(e.currentTarget).data("id"));

      location.highlightMarker();
      map.panTo(location.get("marker").getPosition());
      map.setZoom(5);
    },

    render: function () {
      var name = this.options.type.get("name");
      var locs = locations.where({ type: name });
      this.$el.html(
        this.template({
          type: this.options.type.toJSON(),
          locations: _(locs).map(function (x) {
            var d = x.toJSON();
            if (devMode != "true" && ignoredTitles.includes(d.title)) return;
            if (devMode == "true")
              d.title = d.id + "| " + d.title.replace(name + " ", "");
            else d.title = d.title.replace(name + " ", "");
            return d;
          }),
        })
      );

      $("#types").hide();
      this.$el.show();
      return this;
    },
  });

  var MapView = Backbone.View.extend({
    initialize: function () {
      this.mapType = "Satellite";
      this.mapDetails = {
        Atlas: "#0fa8d2",
        Satellite: "#143d6b",
        Road: "#1862ad",
      };
      this.mapOptions = {
        center: new google.maps.LatLng(66, -125),
        backgroundColor: "#143D6B",
        zoom: 4,
        disableDefaultUI: false,
        mapTypeControl: true,
        keyboardShortcuts: false,
        mapTypeControlOptions: { mapTypeIds: _.keys(this.mapDetails) },
        mapTypeId: this.mapType,
      };

      _.bindAll(this, "getTileImage", "updateMapBackground");

      this.popupTemplate = Handlebars.compile(
        $("#markerPopupTemplate2").html()
      );

      this.listenTo(Vent, "locations:visible", this.showLocations);
      this.listenTo(Vent, "locations:invisible", this.hideLocations);

      this.listenTo(Vent, "location:clicked", this.popupLocation);
    },

    render: function () {
      // Function to update coordination info windows
      function updateCoordinationWindow(markerobject) {
        // Create new info window
        var infoWindow = new google.maps.InfoWindow();

        // onClick listener
        google.maps.event.addListener(markerobject, "click", function (evt) {
          // Set content
          infoWindow.setOptions({
            content:
              "<p>" +
              "Current Lat: " +
              evt.latLng.lat().toFixed(3) +
              "<br>" +
              "Current Lng: " +
              evt.latLng.lng().toFixed(3) +
              "<br>" +
              "Zoom Level: " +
              map.getZoom() +
              "</p>",
          });

          // Open the info window
          infoWindow.open(map, markerobject);
        });

        // onDrag listener
        google.maps.event.addListener(markerobject, "drag", function (evt) {
          // Set content
          infoWindow.setOptions({
            content:
              "<p>" +
              "Current Lat: " +
              evt.latLng.lat().toFixed(3) +
              "<br>" +
              "Current Lng: " +
              evt.latLng.lng().toFixed(3) +
              "<br>" +
              "Zoom Level: " +
              map.getZoom() +
              "</p>",
          });
        });
      }

      var map =
        (this.map =
        window.map =
          new google.maps.Map(this.el, this.mapOptions));

      this.initMapTypes(map, _.keys(this.mapDetails));

      google.maps.event.addListener(
        map,
        "maptypeid_changed",
        this.updateMapBackground
      );

      google.maps.event.addDomListener(map, "tilesloaded", function () {
        if ($("#mapControlWrap").length == 0) {
          $("div.gmnoprint").last().wrap('<div id="mapControlWrap" />');
        }
      });

      window.locs = [];
      google.maps.event.addListener(map, "rightclick", function (e) {
        var marker = new google.maps.Marker({
          map: map,
          moveable: true,
          draggable: true,
          position: e.latLng,
        });
        window.locs.push(marker);
        navigator.clipboard.writeText(
          `{"lat": "${e.latLng.lat().toFixed(3)}", "lng": "${e.latLng
            .lng()
            .toFixed(3)}"}`
        );
        // Check if coords mode is enabled
        if (showCoordinations) {
          // Update/create info window
          updateCoordinationWindow(marker);
        }
      });

      return this;
    },

    getMap: function () {
      return this.map;
    },

    initMapTypes: function (map, types) {
      _.each(
        types,
        function (type) {
          var mapTypeOptions = {
            maxZoom: 7,
            minZoom: 3,
            name: type,
            tileSize: new google.maps.Size(256, 256),
            getTileUrl: this.getTileImage,
          };
          map.mapTypes.set(type, new google.maps.ImageMapType(mapTypeOptions));
        },
        this
      );
    },

    updateMapBackground: function () {
      this.mapType = this.map.getMapTypeId();
      this.$el.css({
        backgroundColor: this.mapDetails[this.mapType],
      });
    },

    getTileImage: function (rawCoordinates, zoomLevel) {
      var coord = this.normalizeCoordinates(rawCoordinates, zoomLevel);
      if (!coord) {
        return null;
      }
      //   console.log("tiles/" + (mapType ? mapType : "satellite") + "/");
      return (
        assetsUrl() +
        "tiles/" +
        (mapType ? mapType : "satellite") +
        "/" +
        zoomLevel +
        "-" +
        coord.x +
        "_" +
        coord.y +
        ".png.webp"
      );
    },

    normalizeCoordinates: function (coord, zoom) {
      var y = coord.y;
      var x = coord.x;

      // tile range in one direction range is dependent on zoom level
      // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
      var tileRange = 1 << zoom;

      // don't repeat across y-axis (vertically)
      if (y < 0 || y >= tileRange) {
        return null;
      }

      // repeat across x-axis
      if (x < 0 || x >= tileRange) {
        x = ((x % tileRange) + tileRange) % tileRange;
      }

      return {
        x: x,
        y: y,
      };
    },

    showLocations: function (locations) {
      _.each(
        locations,
        function (location) {
          var marker = location.get("marker");
          if (!marker.getMap()) {
            marker.setMap(this.map);
          }

          if (
            devMode != "true" &&
            ignoredTitles.includes(location.get("title"))
          )
            marker.setVisible(false);
          else marker.setVisible(true);
        },
        this
      );
    },

    hideLocations: function (locations) {
      _.each(locations, function (location) {
        location.get("marker").setVisible(false);
      });
    },

    popupLocation: function (location, panTo) {
      // if (window.isTourMode) {
      // 	$('#tour-info').html(this.popupTemplate(location.toJSON()));
      // 	var n = locations.at(locations.indexOf(location) + 1);
      // 	if (n) {
      // 		$('#tour-next').text(n.get('title'));
      // 	}
      // 	var p = locations.at(locations.indexOf(location) - 1);
      // 	if (p) {
      // 		$('#tour-prev').text(p.get('title'));
      // 	}

      // 	if (panTo) {
      // 		this.map.panTo(location.get('marker').getPosition());
      // 		this.map.setZoom(5);
      // 	}
      // }
      // else {

      var infoWindow = new google.maps.InfoWindow({
        content: this.popupTemplate(location.toJSON()),
      });

      infoWindow.setOptions({
        maxHeight: 400,
      });

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        infoWindow.setOptions({
          maxWidth: 180,
          maxHeight: 300,
        });
      }

      infoWindow.open(this.map, location.get("marker"));

      this.closePopupLocation();
      this.currentInfoWindow = infoWindow;
      // }
    },

    closePopupLocation: function () {
      if (this.currentInfoWindow) {
        this.currentInfoWindow.close();
      }
    },
  });

  var mapView = new MapView({
    el: "#map",
  });

  var categoriesView = new CategoriesView({
    el: "#types",
    map: mapView.getMap(),
  });

  locations.fetch().done(function () {
    mapView.render();
    categoriesView.render();

    categories
      .chain()
      .filter(function (c) {
        return c.get("enabled");
      })
      .map(function (c) {
        return c.get("name");
      })
      .map(function (name) {
        return locations.where({ type: name });
      })
      .each(function (locs) {
        Vent.trigger("locations:visible", locs);
      })
      .value();

    if (markerRef) {
      const id = locations.models.find((f) => f.attributes.title == markerRef);
      var location = locations.get(Number(id.id));
      if (!location) return;
      location.highlightMarker();
      map.panTo(location.get("marker").getPosition());
      map.setZoom(5);
    }
  });

  $("#tour-prev, #tour-next").click(function (e) {
    e.preventDefault();
    var navTo = $(this).text();
    var x = locations.findWhere({ title: navTo });
    if (x) Vent.trigger("location:clicked", x, true);
  });
});
