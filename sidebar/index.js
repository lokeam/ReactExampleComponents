import {BlogrollCarousel, BlogrollSidebar} from "../Blogroll";
import FacebookPagePlugin from "../facebook/FacebookWidget";
import FixSidebarMarker from "./FixSidebarMarker";
import GoogleAdSidebar from "./GoogleAdSidebar";
import get from "lodash/get";

import MeetTheDJs from "./MeetTheDJs";
import NewsletterWidget from "./NewsletterWidget";
import PrizeAndRewards from "./PrizeAndRewards";
import PromotionWidgetSidebar from "./PromotionWidgetSidebar";
import RssFeedWidget from "./RssFeedWidget";
import SeizeTheDeal from "./SeizeTheDeal";
import TextWidget from "./TextWidget";
import TSIWidget from "./TSIWidget";
import SingleThumbPost from "./SingleThumbPost";
import WeatherWidgetCurrent from "./WeatherWidgetCurrent";

let SidebarComponents = {
  "google-ads-widget": {
    component:GoogleAdSidebar,
    showHeader:false
  },
  "text": {
    component:TextWidget
  },
  "weather-widget-current": {
    component:WeatherWidgetCurrent,
    showHeader:false
  },
  "ts_blogroll-sidebar_thumb_title_date": {
    component:BlogrollSidebar
  },
  "ts_blogroll-sidebar_row_standard": {
    component:BlogrollSidebar
  },
  "ts_blogroll-carousel": {
    component:BlogrollCarousel,
    showHeader:false
  },
  "featured_profiles": {
    component:MeetTheDJs
  },
  "widget_facebook_like_activity_widget": {
    component:FacebookPagePlugin
  },
  "promotion": {
    component:PromotionWidgetSidebar
  },
  "rss-feed": {
    component:RssFeedWidget,
    ownHeader:true
  },
  "widget_tsiwd": {
    component:TSIWidget
  },
  "widget_std": {
    component:SeizeTheDeal
  },
  "tsq_sailthru_newsletter_widget": {
    component:NewsletterWidget,
    showHeader:false
  },
  "single_thumb_post": {
    component:SingleThumbPost
  },
  "fix_sidebar_marker":{
    component: FixSidebarMarker,
    showHeader:false
  },
  "loyalty_widgets_sidebar_feed":{
    component: PrizeAndRewards
  }
};

export const getSidebarWidget = ( groupType, type = "" ) => {
  let key = groupType;
  if( type !== "" ){
    key = groupType + "-" + type;
  }
  // return lodash.get( SidebarComponents, key, false );
  return get( SidebarComponents, key, false );
};
export default SidebarComponents;