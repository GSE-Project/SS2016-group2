import {Page, NavController, Toast} from 'ionic-angular';
import {Test} from '../../providers/test/test';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [Test]
})
export class HomePage {
  private ip: string;
  private reqNumber: number;
  constructor(public nav: NavController, private test: Test) {
    this.reqNumber = 0;
  }
  
  askServiceForMyIP() {
    this.test.load().then((result: any) => {
      let toast = Toast.create({
          message: 'Your IP is: '+result.ip,
          duration: 3000
      });
        
      this.nav.present(toast);
      
      this.ip = result.ip;
      this.reqNumber++;
    });
  }
}
