import {Page, NavController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
/*
  Generated class for the MapPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {
  constructor(public nav: NavController) {
    this.map = null;

    this.loadMap()
  }

  loadMap(){

    let options ={timeout: 10000, enableHighAccuracy: true};

    Geolocation.getCurrentPosition(options).then(function(position) {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mypTypeId: google.maps.MapTypeId.ROADMAP,
      };

      this.map = new google.maps.Map((<HTMLInputElement>document.getElementById("map")), mapOptions);
    });
  }
}
