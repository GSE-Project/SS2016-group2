import {Page} from 'ionic-angular';
import {HomePage} from '../home/home';
import {StopListPage} from '../stop-list/stop-list';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = StopListPage;
  //tab3Root: any = Page3;
}
