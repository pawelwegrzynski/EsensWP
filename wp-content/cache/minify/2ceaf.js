var mecSingleEventDisplayer={getSinglePage:function(id,occurrence,ajaxurl,layout,image_popup){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-modal-preloader');jQuery.ajax({url:ajaxurl,data:"action=mec_load_single_page&id="+id+(occurrence!=null?"&occurrence="+occurrence:"")+"&layout="+layout,type:"get",success:function(response){jQuery('.mec-modal-result').removeClass("mec-modal-preloader");jQuery.featherlight(response);setTimeout(function(){grecaptcha.render("g-recaptcha",{sitekey:mecdata.recapcha_key});},1000);if(image_popup!=0){if(jQuery('.featherlight-content .mec-events-content a img').length>0){jQuery('.featherlight-content .mec-events-content a img').each(function(){jQuery(this).closest('a').attr('data-featherlight','image');});}}},error:function(){}});}};(function($){$.fn.mecSearchForm=function(options){var settings=$.extend({id:0,search_form_element:'',atts:'',callback:function(){}},options);$("#mec_sf_category_"+settings.id).on('change',function(e){search();});$("#mec_sf_location_"+settings.id).on('change',function(e){search();});$("#mec_sf_organizer_"+settings.id).on('change',function(e){search();});$("#mec_sf_speaker_"+settings.id).on('change',function(e){search();});$("#mec_sf_tag_"+settings.id).on('change',function(e){search();});$("#mec_sf_label_"+settings.id).on('change',function(e){search();});$("#mec_sf_s_"+settings.id).on('change',function(e){search();});var mec_sf_month_selector="#mec_sf_month_"+settings.id;var mec_sf_year_selector="#mec_sf_year_"+settings.id;mec_sf_month_selector+=(', '+mec_sf_year_selector);$(mec_sf_month_selector).on('change',function(e){if($(mec_sf_year_selector).find('option:eq(0)').val()=='none')
{var mec_month_val=$(mec_sf_month_selector).val();var mec_year_val=$(mec_sf_year_selector).val();if((mec_month_val!='none'&&mec_year_val!='none')||((mec_month_val=='none'&&mec_year_val=='none')))search();}else search();});$("#mec_sf_event_type_"+settings.id).on('change',function(e){search();});$("#mec_sf_event_type_2_"+settings.id).on('change',function(e){search();});function search(){var s=$("#mec_sf_s_"+settings.id).length?$("#mec_sf_s_"+settings.id).val():'';var category=$("#mec_sf_category_"+settings.id).length?$("#mec_sf_category_"+settings.id).val():'';var location=$("#mec_sf_location_"+settings.id).length?$("#mec_sf_location_"+settings.id).val():'';var organizer=$("#mec_sf_organizer_"+settings.id).length?$("#mec_sf_organizer_"+settings.id).val():'';var speaker=$("#mec_sf_speaker_"+settings.id).length?$("#mec_sf_speaker_"+settings.id).val():'';var tag=$("#mec_sf_tag_"+settings.id).length?$("#mec_sf_tag_"+settings.id).val():'';var label=$("#mec_sf_label_"+settings.id).length?$("#mec_sf_label_"+settings.id).val():'';var month=$("#mec_sf_month_"+settings.id).length?$("#mec_sf_month_"+settings.id).val():'';var year=$("#mec_sf_year_"+settings.id).length?$("#mec_sf_year_"+settings.id).val():'';var event_type=$("#mec_sf_event_type_"+settings.id).length?$("#mec_sf_event_type_"+settings.id).val():'';var event_type_2=$("#mec_sf_event_type_2_"+settings.id).length?$("#mec_sf_event_type_2_"+settings.id).val():'';if(year==='none'&&month==='none')
{year='';month='';}
var atts=settings.atts+'&sf[s]='+s+'&sf[month]='+month+'&sf[year]='+year+'&sf[category]='+category+'&sf[location]='+location+'&sf[organizer]='+organizer+'&sf[speaker]='+speaker+'&sf[tag]='+tag+'&sf[label]='+label+'&sf[event_type]='+event_type+'&sf[event_type_2]='+event_type_2;settings.callback(atts);}};}(jQuery));(function($){$.fn.mecGoogleMaps=function(options){var settings=$.extend({latitude:0,longitude:0,autoinit:true,zoom:14,icon:'../img/m-01.png',markers:{},sf:{},HTML5geolocation:0,getDirection:0,directionOptions:{form:'#mec_get_direction_form',reset:'.mec-map-get-direction-reset',addr:'#mec_get_direction_addr',destination:{},},},options);var bounds;var map;var infowindow;var loadedMarkers=new Array();var markerCluster;var canvas=this;var DOM=canvas[0];if(settings.autoinit)init();function init(){if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;getMarkers();}});}
bounds=new google.maps.LatLngBounds();var center=new google.maps.LatLng(settings.latitude,settings.longitude);var mapOptions={scrollwheel:false,mapTypeId:google.maps.MapTypeId.ROADMAP,center:center,zoom:settings.zoom,styles:settings.styles,};map=new google.maps.Map(DOM,mapOptions);infowindow=new google.maps.InfoWindow({pixelOffset:new google.maps.Size(0,-37)});loadMarkers(settings.markers);var clusterCalculator=function(markers,numStyles){var weight=0;for(var i=0;i<markers.length;++i){weight+=markers[i].weight;}
return{text:weight,index:Math.min(String(weight).length,numStyles)};};markerClusterOptions={styles:[{height:53,url:settings.clustering_images+'1.png',width:53,textColor:'#fff'},{height:56,url:settings.clustering_images+'2.png',width:56,textColor:'#000'},{height:66,url:settings.clustering_images+'3.png',width:66,textColor:'#fff'},{height:78,url:settings.clustering_images+'4.png',width:78,textColor:'#fff'},{height:90,url:settings.clustering_images+'5.png',width:90,textColor:'#fff'}]}
markerCluster=new MarkerClusterer(map,null,markerClusterOptions);markerCluster.setCalculator(clusterCalculator);markerCluster.addMarkers(loadedMarkers);if(settings.getDirection===1)initSimpleGetDirection();else if(settings.getDirection===2)initAdvancedGetDirection();if((settings.HTML5geolocation||(options.geolocation!=='undefined'&&options.geolocation==true))&&navigator.geolocation){navigator.geolocation.getCurrentPosition(function(position){var center=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);var zoom=map.getZoom();if(zoom<=6)zoom=zoom+5;else if(zoom<=10)zoom=zoom+3;else if(zoom<=14)zoom=zoom+2;else if(zoom<=18)zoom=zoom+1;map.panTo(center);map.setZoom(zoom);});}}
function loadMarkers(markers){var f=0;for(var i in markers){f++;var dataMarker=markers[i];var marker=new RichMarker({position:new google.maps.LatLng(dataMarker.latitude,dataMarker.longitude),map:map,event_ids:dataMarker.event_ids,infowindow:dataMarker.infowindow,lightbox:dataMarker.lightbox,icon:(dataMarker.icon?dataMarker.icon:settings.icon),content:'<div class="mec-marker-container"><span class="mec-marker-wrap"><span class="mec-marker">'+dataMarker.count+'</span><span class="mec-marker-pulse-wrap"><span class="mec-marker-pulse"></span></span></span></div>',shadow:'none',weight:dataMarker.count});if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)>960){google.maps.event.addListener(marker,'mouseover',function(event){infowindow.close();infowindow.setContent(this.infowindow);infowindow.open(map,this);});google.maps.event.addListener(marker,'click',function(event){lity(this.lightbox);});}else if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<=960){google.maps.event.addListener(marker,'click',function(event){infowindow.close();infowindow.setContent(this.infowindow);infowindow.open(map,this);lity(this.lightbox);});}
bounds.extend(marker.position);loadedMarkers.push(marker);}
if(f>1)map.fitBounds(bounds);if(f===1){map.setCenter(new google.maps.LatLng(dataMarker.latitude,dataMarker.longitude));}}
function getMarkers(){$("#mec_googlemap_canvas"+settings.id).addClass("mec-loading");$.ajax({url:settings.ajax_url,data:"action=mec_map_get_markers&"+settings.atts,dataType:"json",type:"post",success:function(response){removeMarkers();loadMarkers(response.markers);markerCluster.clearMarkers();markerCluster.addMarkers(loadedMarkers,false);markerCluster.redraw();$("#mec_googlemap_canvas"+settings.id).removeClass("mec-loading");},error:function(){$("#mec_googlemap_canvas"+settings.id).removeClass("mec-loading");}});}
function removeMarkers(){bounds=new google.maps.LatLngBounds();if(loadedMarkers){for(i=0;i<loadedMarkers.length;i++)loadedMarkers[i].setMap(null);loadedMarkers.length=0;}}
var directionsDisplay;var directionsService;var startMarker;var endMarker;function initSimpleGetDirection(){$(settings.directionOptions.form).on('submit',function(event){event.preventDefault();var from=$(settings.directionOptions.addr).val();var dest=new google.maps.LatLng(settings.directionOptions.destination.latitude,settings.directionOptions.destination.longitude);if(typeof directionsDisplay!=='undefined'){directionsDisplay.setMap(null);startMarker.setMap(null);endMarker.setMap(null);}
$(canvas).fadeTo(300,.4);directionsDisplay=new google.maps.DirectionsRenderer({suppressMarkers:true});directionsService=new google.maps.DirectionsService();var request={origin:from,destination:dest,travelMode:google.maps.DirectionsTravelMode.DRIVING};directionsService.route(request,function(response,status){if(status===google.maps.DirectionsStatus.OK){directionsDisplay.setDirections(response);directionsDisplay.setMap(map);var leg=response.routes[0].legs[0];startMarker=new google.maps.Marker({position:leg.start_location,map:map,icon:settings.directionOptions.startMarker,});endMarker=new google.maps.Marker({position:leg.end_location,map:map,icon:settings.directionOptions.endMarker,});}
$(canvas).fadeTo(300,1);});$(settings.directionOptions.reset).removeClass('mec-util-hidden');});$(settings.directionOptions.reset).on('click',function(event){$(settings.directionOptions.addr).val('');$(settings.directionOptions.form).submit();$(settings.directionOptions.reset).addClass('mec-util-hidden');});}
function initAdvancedGetDirection(){$(settings.directionOptions.form).on('submit',function(event){event.preventDefault();var from=$(settings.directionOptions.addr).val();var url='https://maps.google.com/?saddr='+encodeURIComponent(from)+'&daddr='+settings.directionOptions.destination.latitude+','+settings.directionOptions.destination.longitude;window.open(url);});}
return{init:function(){init();}};};}(jQuery));(function($){$.fn.mecFullCalendar=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},skin:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-totalcal-box .mec-totalcal-view span").on('click',function(e){e.preventDefault();var skin=$(this).data('skin');var mec_month_select=$('#mec_sf_month_'+settings.id);var mec_year_select=$('#mec_sf_year_'+settings.id);if(skin=='list')
{var mec_filter_none='<option class="mec-none-item" value="none" selected="selected">'+$('#mec-filter-none').val()+'</option>';if(mec_month_select.find('.mec-none-item').length==0)mec_month_select.prepend(mec_filter_none);if(mec_year_select.find('.mec-none-item').length==0)mec_year_select.prepend(mec_filter_none);}
else
{if(mec_month_select.find('.mec-none-item').length!=0)mec_month_select.find('.mec-none-item').remove();if(mec_year_select.find('.mec-none-item').length!=0)mec_year_select.find('.mec-none-item').remove();}
$(this).addClass('mec-totalcalview-selected').siblings().removeClass('mec-totalcalview-selected');loadSkin(skin);});}
function loadSkin(skin){settings.skin=skin;if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_full_calendar_switch_skin&skin="+skin+"&"+settings.atts+"&apply_sf_date=1&sed="+settings.sed_method,dataType:"json",type:"post",success:function(response){$("#mec_full_calendar_container_"+settings.id).html(response);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFocusDay(settings.id);mec_focus_week(settings.id);},error:function(){}});}
function search(){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_full_calendar_switch_skin&skin="+settings.skin+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$("#mec_full_calendar_container_"+settings.id).html(response);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFocusDay(settings.id);mec_focus_week(settings.id);},error:function(){}});}};}(jQuery));(function($){$.fn.mecYearlyView=function(options){var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',year_navigator:0,atts:'',next_year:{},sf:{},ajax_url:'',},options);if(settings.year_navigator)initYearNavigator();if(settings.year_navigator)setYear(settings.next_year.year,true);setListeners();$(document).on("click","#mec_skin_events_"+settings.id+" .mec-load-more-button",function(){var year=$(this).parent().parent().parent().data('year-id');loadMoreButton(year);});if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;active_year=$('.mec-yearly-view-wrap .mec-year-navigator').filter(function(){return $(this).css('display')=="block";});active_year=parseInt(active_year.find('h2').text());search(active_year);}});}
function initYearNavigator(){$("#mec_skin_"+settings.id+" .mec-load-year").off("click");$("#mec_skin_"+settings.id+" .mec-load-year").on("click",function(){var year=$(this).data("mec-year");setYear(year);});}
function search(year){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_yearly_view_load_year&mec_year="+year+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_year=response.current_year.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-year-container" id="mec_yearly_view_year_'+settings.id+'_'+response.current_year.id+'" data-year-id="'+response.current_year.id+'">'+response.year+'</div>');$("#mec_skin_"+settings.id+" .mec-yearly-title-sec").append('<div class="mec-year-navigator" id="mec_year_navigator_'+settings.id+'_'+response.current_year.id+'">'+response.navigator+'</div>');initYearNavigator();setListeners();toggleYear(response.current_year.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");},error:function(){}});}
function setYear(year,do_in_background){if(typeof do_in_background==="undefined")do_in_background=false;var year_id=year;active_year=year;if($("#mec_yearly_view_year_"+settings.id+"_"+year_id).length){toggleYear(year_id);}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_yearly_view_load_year&mec_year="+year+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-year-container" id="mec_yearly_view_year_'+settings.id+'_'+response.current_year.id+'" data-year-id="'+response.current_year.id+'">'+response.year+'</div>');$("#mec_skin_"+settings.id+" .mec-yearly-title-sec").append('<div class="mec-year-navigator" id="mec_year_navigator_'+settings.id+'_'+response.current_year.id+'">'+response.navigator+'</div>');initYearNavigator();setListeners();if(!do_in_background){toggleYear(response.current_year.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_yearly_view_year_"+settings.id+"_"+response.current_year.id).hide();$("#mec_year_navigator_"+settings.id+"_"+response.current_year.id).hide();}},error:function(){}});}}
function toggleYear(year_id){$("#mec_skin_"+settings.id+" .mec-year-navigator").hide();$("#mec_year_navigator_"+settings.id+"_"+year_id).show();$("#mec_skin_"+settings.id+" .mec-year-container").hide();$("#mec_yearly_view_year_"+settings.id+"_"+year_id).show();}
var sf;function setListeners(){if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-agenda-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMoreButton(year){var $max_count,$current_count=0;$max_count=$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-yearly-max").data('count');$current_count=$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").length;if($current_count>10){for(var i=0;i<10;i++){$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").slice(0,2).each(function(){$(this).removeClass('mec-util-hidden');});}}
if($current_count<10&&$current_count!=0){for(var j=0;j<$current_count;j++){$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").slice(0,2).each(function(){$(this).removeClass('mec-util-hidden');$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-load-more-wrap").css('display','none');});}}}};}(jQuery));(function($){$.fn.mecMonthlyView=function(options){var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:'',},options);if(settings.month_navigator)initMonthNavigator();setMonth(settings.next_month.year,settings.next_month.month,true);active_month=settings.active_month.month;active_year=settings.active_month.year;setListeners();if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month);}});}
function initMonthNavigator(){$("#mec_skin_"+settings.id+" .mec-load-month").off("click");$("#mec_skin_"+settings.id+" .mec-load-month").on("click",function(){var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function search(year,month){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_monthly_view_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_monthly_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-monthly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-events-side").html('<div class="mec-month-side" id="mec_month_side_'+settings.id+'_'+response.current_month.id+'">'+response.events_side+'</div>');initMonthNavigator();setListeners();toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click){if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background){active_month=month;active_year=year;}
if($("#mec_monthly_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_monthly_view_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_monthly_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-monthly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-events-side").append('<div class="mec-month-side" id="mec_month_side_'+settings.id+'_'+response.current_month.id+'">'+response.events_side+'</div>');initMonthNavigator();setListeners();if(!do_in_background){toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_monthly_view_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_side_"+settings.id+"_"+response.current_month.id).hide();}
if(typeof custom_month!==undefined)var custom_month;if(typeof custom_month!=undefined){if(custom_month=='true'){$(".mec-month-container .mec-calendar-day").removeClass('mec-has-event');$(".mec-month-container .mec-calendar-day").removeClass('mec-selected-day');$('.mec-calendar-day').unbind('click');}}},error:function(){}});}}
function toggleMonth(month_id){var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_monthly_view_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide();$("#mec_monthly_view_month_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").removeClass("mec-month-container-selected");$("#mec_monthly_view_month_"+settings.id+"_"+month_id).addClass("mec-month-container-selected");$("#mec_skin_"+settings.id+" .mec-month-side").hide();$("#mec_month_side_"+settings.id+"_"+month_id).show();}
var sf;function setListeners(){$("#mec_skin_"+settings.id+" .mec-has-event").off("click");$("#mec_skin_"+settings.id+" .mec-has-event").on('click',function(e){e.preventDefault();var $this=$(this),data_mec_cell=$this.data('mec-cell'),month_id=$this.data('month');$("#mec_monthly_view_month_"+settings.id+"_"+month_id+" .mec-calendar-day").removeClass('mec-selected-day');$this.addClass('mec-selected-day');$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();});mec_tooltip();if(settings.sed_method!='0'){sed();}
if(settings.style=='novel'){if($('.mec-single-event-novel').length>0){$('.mec-single-event-novel').colourBrightness();$('.mec-single-event-novel').each(function(){$(this).colourBrightness()});}}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a,#mec_skin_"+settings.id+" .event-single-link-novel").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function mec_tooltip(){if($('.mec-monthly-tooltip').length>1){if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)>768){$('.mec-monthly-tooltip').tooltipster({theme:'tooltipster-shadow',interactive:true,delay:100,minWidth:350,maxWidth:350});}else{var touchtime=0;$(".mec-monthly-tooltip").on("click",function(event){event.preventDefault();if(touchtime==0){$('.mec-monthly-tooltip').tooltipster({theme:'tooltipster-shadow',interactive:true,delay:100,minWidth:350,maxWidth:350,trigger:"custom",triggerOpen:{click:true,tap:true},triggerClose:{click:true,tap:true}});touchtime=new Date().getTime();}else{if(((new Date().getTime())-touchtime)<200){var el=$(this);var link=el.attr("href");window.location=link;touchtime=0;}else{touchtime=new Date().getTime();}}});}}}};}(jQuery));(function($){$.fn.mecWeeklyView=function(options){var active_year;var active_month;var active_week;var active_week_number;var settings=$.extend({today:null,week:1,id:0,current_year:null,current_month:null,changeWeekElement:'.mec-load-week',month_navigator:0,atts:'',ajax_url:'',sf:{}},options);active_year=settings.current_year;active_month=settings.current_month;if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_week);}});}
setThisWeek(settings.month_id+settings.week);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);function setListeners(){$(settings.changeWeekElement).off('click').on('click',function(e){var week=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-id');var max_weeks=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('max-weeks');var new_week_number=active_week_number;if($(this).hasClass('mec-previous-month')){week=parseInt(week)-1;new_week_number--;}else{week=parseInt(week)+1;new_week_number++;}
if(new_week_number<=1||new_week_number>=max_weeks){$(this).css({'opacity':.6,'cursor':'default'});$(this).find('i').css({'opacity':.6,'cursor':'default'});}else{$('#mec_skin_'+settings.id+' .mec-load-week, #mec_skin_'+settings.id+' .mec-load-week i').css({'opacity':1,'cursor':'pointer'});}
if(new_week_number===0||new_week_number>max_weeks){}else{setThisWeek(week);}});if(settings.sed_method!='0'){sed();}}
function setThisWeek(week,auto_focus){if(typeof auto_focus==='undefined')auto_focus=false;if(!$('#mec_weekly_view_week_'+settings.id+'_'+week).length){return setThisWeek((parseInt(week)-1));}
$('#mec_skin_'+settings.id+' .mec-weekly-view-week').removeClass('mec-weekly-view-week-active');$('#mec_weekly_view_week_'+settings.id+'_'+week).addClass('mec-weekly-view-week-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-date-events').addClass('mec-util-hidden');$('.mec-weekly-view-week-'+settings.id+'-'+week).removeClass('mec-util-hidden');active_week=week;active_week_number=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-number');$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').find('span').remove();$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').append('<span>'+active_week_number+'</span>');if(active_week_number===1){$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').css({'opacity':.6,'cursor':'default'});$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').find('i').css({'opacity':.6,'cursor':'default'});}
if(auto_focus)mec_focus_week(settings.id);}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click');$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,active_week,true);});}
function search(year,month,week,navigation_click){var week_number=(String(week).slice(-1));if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weekly_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_weekly_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(active_week,true);},error:function(){}});}
function setMonth(year,month,week,navigation_click){var month_id=''+year+month;var week_number=(String(week).slice(-1));active_month=month;active_year=year;navigation_click=navigation_click||false;if($("#mec_weekly_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setThisWeek(''+month_id+week_number);}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weekly_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigation_click,dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_weekly_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id,true);$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);},error:function(){}});}}
function toggleMonth(month_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_weekly_view_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecDailyView=function(options){var active_month;var active_year;var active_day;var settings=$.extend({today:null,id:0,changeDayElement:'.mec-daily-view-day',events_label:'Events',event_label:'Event',month_navigator:0,atts:'',ajax_url:'',sf:{},},options);active_month=settings.month;active_year=settings.year;active_day=settings.day;setToday(settings.today);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);initDaysSlider(settings.month_id);mecFocusDay(settings.id);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_day);}});}
function setListeners(){$(settings.changeDayElement).on('click',function(){var today=$(this).data('day-id');setToday(today);});if(settings.sed_method!='0'){sed();}}
var current_monthday;function setToday(today){if(!$('#mec_daily_view_day'+settings.id+'_'+today).length){setToday(parseInt(today)-1);return false;}
$('.mec-daily-view-day').removeClass('mec-daily-view-day-active mec-color');$('#mec_daily_view_day'+settings.id+'_'+today).addClass('mec-daily-view-day-active mec-color');$('.mec-daily-view-date-events').addClass('mec-util-hidden');$('#mec_daily_view_date_events'+settings.id+'_'+today).removeClass('mec-util-hidden');var weekday=$('#mec_daily_view_day'+settings.id+'_'+today).data('day-weekday');var monthday=$('#mec_daily_view_day'+settings.id+'_'+today).data('day-monthday');var count=$('#mec_daily_view_day'+settings.id+'_'+today).data('events-count');var month_id=$('#mec_daily_view_day'+settings.id+'_'+today).data('month-id');$('#mec_today_container'+settings.id+'_'+month_id).html('<h2>'+monthday+'</h2><h3>'+weekday+'</h3><div class="mec-today-count">'+count+' '+(count>1?settings.events_label:settings.event_label)+'</div>');if(monthday<=9)current_monthday='0'+monthday;else current_monthday=monthday;}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click');$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,current_monthday,true);});}
function initDaysSlider(month_id,day_id){mec_g_month_id=month_id;var owl_rtl=$('body').hasClass('rtl')?true:false;var owl=$("#mec-owl-calendar-d-table-"+settings.id+"-"+month_id);owl.owlCarousel({responsiveClass:true,responsive:{0:{items:2,},479:{items:4,},767:{items:7,},960:{items:14,},1000:{items:19,},1200:{items:22,}},dots:false,loop:false,rtl:owl_rtl,});$("#mec_daily_view_month_"+settings.id+"_"+month_id+" .mec-table-d-next").click(function(e){e.preventDefault();owl.trigger('next.owl.carousel');});$("#mec_daily_view_month_"+settings.id+"_"+month_id+" .mec-table-d-prev").click(function(e){e.preventDefault();owl.trigger('prev.owl.carousel');});if(typeof day_id==='undefined')day_id=$('.mec-daily-view-day-active').data('day-id');var today_str=day_id.toString().substring(6,8);var today_int=parseInt(today_str);owl.trigger('owl.goTo',[today_int]);}
function search(year,month,day){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_daily_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_day="+day+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_daily_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-a-month.mec-clear").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();active_year=response.current_month.year;active_month=response.current_month.month;toggleMonth(response.current_month.id,''+active_year+active_month+active_day);setToday(''+active_year+active_month+active_day);mecFocusDay(settings.id);},error:function(){}});}
function setMonth(year,month,day,navigation_click){var month_id=''+year+month;active_month=month;active_year=year;active_day=day;navigation_click=navigation_click||false;if($("#mec_daily_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setToday(''+month_id+day);}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_daily_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_day="+day+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigation_click,dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_daily_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-a-month.mec-clear").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id,''+year+month+'01');setToday(''+year+month+'01');$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);},error:function(){}});}}
function toggleMonth(month_id,day_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_daily_view_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);initDaysSlider(month_id,day_id);mecFocusDay(settings.id);}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecTimeTable=function(options){var active_year;var active_month;var active_week;var active_week_number;var active_day;var settings=$.extend({today:null,week:1,active_day:1,id:0,changeWeekElement:'.mec-load-week',month_navigator:0,atts:'',ajax_url:'',sf:{}},options);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_week,active_day);}});}
setThisWeek(settings.month_id+settings.week,settings.active_day);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);function setListeners(){$(settings.changeWeekElement).off('click').on('click',function(){var week=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-id');var max_weeks=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('max-weeks');var new_week_number=active_week_number;if($(this).hasClass('mec-previous-month')){week=parseInt(week)-1;new_week_number--;}else{week=parseInt(week)+1;new_week_number++;}
if(new_week_number<=1||new_week_number>=max_weeks){$(this).css({'opacity':.6,'cursor':'default'});$(this).find('i').css({'opacity':.6,'cursor':'default'});}else{$('#mec_skin_'+settings.id+' .mec-load-week, #mec_skin_'+settings.id+' .mec-load-week i').css({'opacity':1,'cursor':'pointer'});}
if(new_week_number===0||new_week_number>max_weeks){}else{setThisWeek(week);}});$('#mec_skin_'+settings.id+' .mec-weekly-view-week dt').not('.mec-timetable-has-no-event').off('click').on('click',function(){var day=$(this).data('date-id');setDay(day);});if(settings.sed_method!='0'){sed();}}
function setThisWeek(week,day){if(!$('#mec_weekly_view_week_'+settings.id+'_'+week).length){return setThisWeek((parseInt(week)-1),day);}
$('#mec_skin_'+settings.id+' .mec-weekly-view-week').removeClass('mec-weekly-view-week-active');$('#mec_weekly_view_week_'+settings.id+'_'+week).addClass('mec-weekly-view-week-active');setDay(day);active_week=week;active_week_number=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-number');$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').find('span').remove();$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').append('<span>'+active_week_number+'</span>');if(active_week_number===1){$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').css({'opacity':.6,'cursor':'default'});$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').find('i').css({'opacity':.6,'cursor':'default'});}}
function setDay(day){if(typeof day==='undefined'){day=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active dt').not('.mec-timetable-has-no-event').first().data('date-id');}
$('#mec_skin_'+settings.id+' dt').removeClass('mec-timetable-day-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active dt[data-date-id="'+day+'"]').addClass('mec-timetable-day-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-date-events').addClass('mec-util-hidden');$('#mec_weekly_view_date_events'+settings.id+'_'+day).removeClass('mec-util-hidden');}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,active_week);});}
function search(year,month,week){var week_number=(String(week).slice(-1));if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');year=typeof year=='undefined'?'':year;month=typeof month=='undefined'?'':month;$.ajax({url:settings.ajax_url,data:"action=mec_timetable_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_timetable_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id);mec_focus_week(settings.id);},error:function(){}});}
function setMonth(year,month,week){var month_id=''+year+month;var week_number=(String(week).slice(-1));active_month=month;active_year=year;if($("#mec_timetable_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setThisWeek(''+month_id+week_number);}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_timetable_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_timetable_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id);$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);},error:function(){}});}}
function toggleMonth(month_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_timetable_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);}
function sed(){$("#mec_skin_"+settings.id+" .mec-timetable-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecWeeklyProgram=function(options){var settings=$.extend({id:0,atts:'',sf:{}},options);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
setListeners();function setListeners(){if(settings.sed_method!='0'){sed();}}
function search(){var $modal=$('.mec-modal-result');if($modal.length===0)$('.mec-wrap').append('<div class="mec-modal-result"></div>');$modal.addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weeklyprogram_load&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$modal.removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html(response.date_events);setListeners();},error:function(){}});}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecMasonryView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();jQuery(window).load(function(){initMasonry();if(typeof custom_dev!==undefined)var custom_dev;if(custom_dev=='yes'){$(".mec-wrap").css("height","1550");if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<768){$(".mec-wrap").css("height","5500");}
if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<480){$(".mec-wrap").css("height","5000");}
$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","none");$(".mec-load-more-button").on("click",function(){$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","block");$(".mec-wrap").css("height","auto");initMasonry();$(".mec-load-more-button").hide();})
$(".mec-events-masonry-cats a:first-child").on("click",function(){$(".mec-wrap").css("height","auto");$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","block");$(".mec-load-more-button").hide();initMasonry();})
$(".mec-events-masonry-cats a:not(:first-child)").on("click",function(){$(".mec-load-more-button").hide();$(".mec-wrap").css("height","auto");$(".mec-wrap").css("min-height","400");$(".mec-event-masonry .mec-masonry-item-wrap").css("display","block");var element=document.querySelector("#mec_skin_"+settings.id+" .mec-event-masonry");var selector=$(this).attr('data-group');var CustomShuffle=new Shuffle(element,{itemSelector:'.mec-masonry-item-wrap',});CustomShuffle.sort({by:element.getAttribute('data-created'),});CustomShuffle.filter(selector!='*'?selector:Shuffle.ALL_ITEMS);$(".mec-event-masonry .mec-masonry-item-wrap").css("visibility","visible");})}});if(mecdata.elementor_edit_mode!='no')elementorFrontend.hooks.addAction('frontend/element_ready/global',initMasonry());function initMasonry(){var $container=$("#mec_skin_"+settings.id+" .mec-event-masonry");var $grid=$container.isotope({filter:'*',itemSelector:'.mec-masonry-item-wrap',getSortData:{date:'[data-sort-masonry]',},sortBy:'date',animationOptions:{duration:750,easing:'linear',queue:false},});if(settings.fit_to_row==1)$grid.isotope({layoutMode:'fitRows'});$('.elementor-tabs').find('.elementor-tab-title').click(function(){$grid.isotope({sortBy:'date'});});$("#mec_skin_"+settings.id+" .mec-events-masonry-cats a").click(function(){var selector=$(this).attr('data-filter');var $grid_cat=$container.isotope({filter:selector,itemSelector:'.mec-masonry-item-wrap',getSortData:{date:'[data-sort-masonry]',},sortBy:'date',animationOptions:{duration:750,easing:'linear',queue:false},});if(settings.masonry_like_grid==1)$grid_cat.isotope({sortBy:'date'});return false;});var $optionSets=$("#mec_skin_"+settings.id+" .mec-events-masonry-cats"),$optionLinks=$optionSets.find('a');$optionLinks.click(function(){var $this=$(this);if($this.hasClass('selected'))return false;var $optionSet=$this.parents('.mec-events-masonry-cats');$optionSet.find('.mec-masonry-cat-selected').removeClass('mec-masonry-cat-selected');$this.addClass('mec-masonry-cat-selected');});}
function setListeners(){if(settings.sed_method!='0'){sed();}}
$("#mec_skin_"+settings.id+" .mec-events-masonry-cats > a").click(function()
{var mec_load_more_btn=$("#mec_skin_"+settings.id+" .mec-load-more-button");var mec_filter_value=$(this).data('filter').replace('.mec-t','');if(mec_load_more_btn.hasClass('mec-load-more-loading'))mec_load_more_btn.removeClass('mec-load-more-loading');if(mec_load_more_btn.hasClass("mec-hidden-"+mec_filter_value))mec_load_more_btn.addClass("mec-util-hidden");else mec_load_more_btn.removeClass("mec-util-hidden");});$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");var mec_filter_value=$('#mec_skin_'+settings.id).find('.mec-masonry-cat-selected').data('filter').replace('.mec-t','');var mec_filter_by=$('#mec_skin_'+settings.id).data('filterby');$.ajax({url:settings.ajax_url,data:"action=mec_masonry_load_more&mec_filter_by="+mec_filter_by+"&mec_filter_value="+mec_filter_value+"&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden mec-hidden-"+mec_filter_value);}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");var node=$("#mec_skin_"+settings.id+" .mec-event-masonry");var markup='',newItems=$(response.html).find('.mec-masonry-item-wrap');newItems.each(function(index){node.isotope().append(newItems[index]).isotope('appended',newItems[index]);});$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecListView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},current_month_divider:'',end_date:'',offset:0,limit:0},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.style==='accordion'){if(settings.toggle_month_divider){$('#mec_skin_'+settings.id+' .mec-month-divider:first-of-type').addClass('active');$('#mec_skin_'+settings.id+' .mec-month-divider:first-of-type').find('i').removeClass('mec-sl-arrow-down').addClass('mec-sl-arrow-up');toggle();}
accordion();}
if(settings.sed_method!='0'){sed();}}
function toggle(){$('#mec_skin_'+settings.id+' .mec-month-divider').off("click").on("click",function(event){event.preventDefault();var status=$(this).hasClass('active');$('#mec_skin_'+settings.id+' .mec-month-divider').removeClass('active');$('#mec_skin_'+settings.id+' .mec-divider-toggle').slideUp('fast');if(status){$(this).removeClass('active');$('.mec-month-divider').find('i').removeClass('mec-sl-arrow-up').addClass('mec-sl-arrow-down');}else{$(this).addClass('active');$('.mec-month-divider').find('i').removeClass('mec-sl-arrow-up').addClass('mec-sl-arrow-down')
$(this).find('i').removeClass('mec-sl-arrow-down').addClass('mec-sl-arrow-up');var month=$(this).data('toggle-divider');$('#mec_skin_'+settings.id+' .'+month).slideDown('fast');}});}
function toggleLoadmore(){$('#mec_skin_'+settings.id+' .mec-month-divider:not(.active)').each(function(){var month=$(this).data('toggle-divider');$('#mec_skin_'+settings.id+' .'+month).slideUp('fast');});toggle();}
function accordion(){$("#mec_skin_"+settings.id+" .mec-toggle-item-inner").off("click").on("click",function(event){event.preventDefault();var $this=$(this);$(this).parent().find(".mec-content-toggle").slideToggle("fast",function(){$this.children("i").toggleClass("mec-sl-arrow-down mec-sl-arrow-up");});var unique_id=$(this).parent().find(".mec-modal-wrap").data('unique-id');window['mec_init_gmap'+unique_id]();});}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button, #mec_skin_"+settings.id+" .mec-detail-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_list_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&current_month_divider="+settings.current_month_divider+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=='0'){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}
if(settings.style==='accordion'){if(settings.toggle_month_divider)toggleLoadmore();accordion();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_list_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}
if(settings.style==='accordion'){if(settings.toggle_month_divider)toggle();accordion();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecGridView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecCustomView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_custom_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if($('.mec-event-sd-countdown').length>0)
{$('.mec-event-sd-countdown').each(function(event){var dc=$(this).attr('data-date-custom');$(this).mecCountDown({date:dc,format:"off"},function(){});})}
if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_custom_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecTimelineView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_timeline_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_timeline_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecAgendaView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},current_month_divider:'',end_date:'',offset:0,},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-agenda-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_agenda_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&current_month_divider="+settings.current_month_divider+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_agenda_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecCarouselView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},items:3,autoplay:'',style:'type1',start_date:''},options);initSlider();function initSlider(){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
if(settings.style==='type1'){var owl=$("#mec_skin_"+settings.id+" .mec-event-carousel-type1 .mec-owl-carousel");owl.owlCarousel({autoplay:true,autoplayTimeout:settings.autoplay,loop:true,items:settings.items,responsiveClass:true,responsive:{0:{items:1,},979:{items:2,},1199:{items:settings.count,}},dots:true,nav:false,autoplayHoverPause:true,rtl:owl_rtl,});owl.bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}else if(settings.style==='type4'){$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,loop:true,autoplayTimeout:settings.autoplay,items:settings.items,dots:false,nav:true,responsiveClass:true,responsive:{0:{items:1,stagePadding:50,},979:{items:2,},1199:{items:settings.count,}},autoplayHoverPause:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});$("#mec_skin_"+settings.id+" .mec-owl-carousel").bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}else{$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,loop:true,autoplayTimeout:settings.autoplay,items:settings.items,dots:false,nav:true,responsiveClass:true,responsive:{0:{items:1,},979:{items:2,},1199:{items:settings.count,}},autoplayHoverPause:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});$("#mec_skin_"+settings.id+" .mec-owl-carousel").bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}}};}(jQuery));(function($){$.fn.mecSliderView=function(options){var settings=$.extend({id:0,atts:'',autoplay:false,ajax_url:'',sf:{},start_date:''},options);initSlider();function initSlider(){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,autoplayTimeout:settings.autoplay,loop:true,items:1,responsiveClass:true,responsive:{0:{items:1,},960:{items:1,},1200:{items:1,}},dots:false,nav:true,autoplayHoverPause:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});}};}(jQuery));(function($){$.fn.mecCountDown=function(options,callBack){var settings=$.extend({date:null,format:null},options);var callback=callBack;var selector=$(this);startCountdown();var interval=setInterval(startCountdown,1000);function startCountdown(){var eventDate=Date.parse(settings.date)/1000;var currentDate=Math.floor($.now()/1000);if(eventDate<=currentDate){callback.call(this);clearInterval(interval);}
var seconds=eventDate-currentDate;var days=Math.floor(seconds/(60*60*24));seconds-=days*60*60*24;var hours=Math.floor(seconds/(60*60));seconds-=hours*60*60;var minutes=Math.floor(seconds/60);seconds-=minutes*60;if(days==1)selector.find(".mec-timeRefDays").text(mecdata.day);else selector.find(".mec-timeRefDays").text(mecdata.days);if(hours==1)selector.find(".mec-timeRefHours").text(mecdata.hour);else selector.find(".mec-timeRefHours").text(mecdata.hours);if(minutes==1)selector.find(".mec-timeRefMinutes").text(mecdata.minute);else selector.find(".mec-timeRefMinutes").text(mecdata.minutes);if(seconds==1)selector.find(".mec-timeRefSeconds").text(mecdata.second);else selector.find(".mec-timeRefSeconds").text(mecdata.seconds);if(settings.format==="on"){days=(String(days).length>=2)?days:"0"+days;hours=(String(hours).length>=2)?hours:"0"+hours;minutes=(String(minutes).length>=2)?minutes:"0"+minutes;seconds=(String(seconds).length>=2)?seconds:"0"+seconds;}
if(!isNaN(eventDate)){selector.find(".mec-days").text(days);selector.find(".mec-hours").text(hours);selector.find(".mec-minutes").text(minutes);selector.find(".mec-seconds").text(seconds);}else{clearInterval(interval);}}};}(jQuery));(function($)
{$.fn.mecTileView=function(options)
{var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:''},options);if(settings.month_navigator)initMonthNavigator();setMonth(settings.next_month.year,settings.next_month.month,true);active_month=settings.active_month.month;active_year=settings.active_month.year;setListeners();if(settings.sf.container!=='')
{sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts)
{settings.atts=atts;search(active_year,active_month);}});}
function initMonthNavigator()
{$("#mec_skin_"+settings.id+" .mec-load-month").off("click");$("#mec_skin_"+settings.id+" .mec-load-month").on("click",function()
{var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function search(year,month)
{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_tile_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response)
{active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_tile_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-monthly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();setListeners();toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click)
{if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background)
{active_month=month;active_year=year;}
if($("#mec_tile_month_"+settings.id+"_"+month_id).length)
{toggleMonth(month_id);}
else
{if(!do_in_background)
{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_tile_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response)
{$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_tile_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-tile-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();setListeners();if(!do_in_background)
{toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}
else
{$("#mec_tile_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();}},error:function(){}});}}
function toggleMonth(month_id)
{var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_tile_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide().removeClass("mec-month-container-selected");$("#mec_tile_month_"+settings.id+"_"+month_id).show().addClass("mec-month-container-selected");}
var sf;function setListeners()
{$("#mec_skin_"+settings.id+" .mec-has-event").off("click");$("#mec_skin_"+settings.id+" .mec-has-event").on('click',function(e)
{e.preventDefault();var $this=$(this),data_mec_cell=$this.data('mec-cell'),month_id=$this.data('month');$("#mec_monthly_view_month_"+settings.id+"_"+month_id+" .mec-calendar-day").removeClass('mec-selected-day');$this.addClass('mec-selected-day');$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();});if(settings.sed_method!='0')
{sed();}}
function sed()
{$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e)
{e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));function mec_gateway_selected(gateway_id){jQuery('.mec-book-form-gateway-checkout').addClass('mec-util-hidden');jQuery('#mec_book_form_gateway_checkout'+gateway_id).removeClass('mec-util-hidden');}
function mec_wrap_resize(){var $mec_wrap=jQuery('.mec-wrap'),mec_width=$mec_wrap.width();if(mec_width<959){$mec_wrap.addClass('mec-sm959');}else{$mec_wrap.removeClass('mec-sm959');}}
function get_parameter_by_name(name,url){if(!url){url=window.location.href;}
name=name.replace(/[\[\]]/g,"\\$&");var regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),results=regex.exec(url);if(!results)return null;if(!results[2])return'';return decodeURIComponent(results[2].replace(/\+/g," "));}
var mec_g_month_id=null;function mecFocusDay(id){setTimeout(function(){var owl_go=jQuery("#mec-owl-calendar-d-table-"+id+"-"+mec_g_month_id);owl_go.find('.owl-stage > div').each(function(index){if(parseInt(jQuery(this).children('div').data("events-count"))>0){var index_plus=index+1;jQuery('#mec_daily_view_day'+id+'_'+mec_g_month_id+(index<10?'0'+index_plus:index_plus)).trigger('click');owl_go.trigger('to.owl.carousel',index_plus);return false;}});},1000);}
function mec_focus_week(id){var days=jQuery('.mec-weeks-container .mec-weekly-view-week-active').parent().find('dt');var days_count=parseInt(days.length);days.each(function(index){var index_plus=index+1;var week=parseInt(jQuery(this).parent().index());if(jQuery(this).data('events-count')>0){for(var i=0;i<week;i++){setTimeout(function(){var event=new Event('click');jQuery('#mec_skin_'+id+' .mec-next-month.mec-load-week')[0].dispatchEvent(event);},33);}
return false;}});}
(function($){$(document).ready(function(){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
$(".mec-widget .mec-event-grid-classic").addClass('mec-owl-carousel mec-owl-theme');$(".mec-widget .mec-event-grid-classic").owlCarousel({autoplay:true,autoplayTimeout:3000,autoplayHoverPause:true,loop:true,dots:false,nav:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],items:1,autoHeight:true,responsiveClass:true,rtl:owl_rtl,});mec_wrap_resize();jQuery(window).bind('resize',function(){mec_wrap_resize();});$('.mec-event-sharing-wrap').hover(function(){$(this).find('.mec-event-sharing').show(0);},function(){$(this).find('.mec-event-sharing').hide(0);});$('a.simple-booking[href^="#mec-events-meta-group-booking"]').click(function(){if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');if(target.length){var scrollTopVal=target.offset().top-30;$('html, body').animate({scrollTop:scrollTopVal},600);return false;}}});if($('.single-mec-events .mec-single-event:not(".mec-single-modern")').length>0){if($('.single-mec-events .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox').length>0){var html=$('.single-mec-events .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox')[0].outerHTML;if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<960){$('.single-mec-events .col-md-4 .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox').remove();$('.single-mec-events .mec-event-info-mobile').html(html)}}}
$('.mec-yearly-calendar .mec-has-event a').on('click',function(e){e.preventDefault();var des=$(this).attr('href');$('.mec-events-agenda').removeClass('mec-selected');$(des).closest('.mec-events-agenda').addClass('mec-selected');var scrollTopVal=$(des).closest('.mec-events-agenda').offset().top-35;$('html, body').animate({scrollTop:scrollTopVal},300);});});})(jQuery);(function($){function convertToC(value){return Math.round(((parseFloat(value)-32)*5/9));}
function convertToF(value){return Math.round(((1.8*parseFloat(value))+32));}
function MPHToKPH(value){return Math.round(1.609344*parseFloat(value));}
function KPHToMPH(value){return Math.round((0.6214*parseFloat(value)));}
$(document).ready(function($){var degree=$('.mec-weather-summary-temp');var weather_extra=$('.mec-weather-extras');var wind=weather_extra.children('.mec-weather-wind');var visibility=weather_extra.children('.mec-weather-visibility');$('.degrees-mode').click(function(){var degree_mode=degree.children('var').text().trim();var wind_text=wind.text().substring(5);var visibility_text=visibility.text().substring(11);if(degree_mode==degree.data('c').trim()){degree.html(convertToF(parseInt(degree.text()))+' <var>'+degree.data('f')+'</var>');wind.html('<span>Wind:</span> '+KPHToMPH(parseInt(wind_text))+'<var>'+wind.data('mph')+'</var>');visibility.html('<span>Visibility:</span> '+KPHToMPH(parseInt(visibility_text))+'<var>'+visibility.data('mph')+'</var>');$(this).text($(this).data('metric'));}else if(degree_mode==degree.data('f').trim()){degree.html(convertToC(parseInt(degree.text()))+' <var>'+degree.data('c')+'</var>');wind.html('<span>Wind:</span> '+MPHToKPH(parseInt(wind_text))+'<var>'+wind.data('kph')+'</var>');visibility.html('<span>Visibility:</span> '+MPHToKPH(parseInt(visibility_text))+'<var>'+visibility.data('kph')+'</var>');$(this).text($(this).data('imperial'));}});$('a').on('click',function(){})
$('#mec_add_speaker_button').on('click',function(){var $this=this;var content=$($this).parent().find('input');var list=$('#mec-fes-speakers-list');var key=list.find('.mec-error').length;$($this).prop("disabled",true).css('cursor','wait');$.post(ajaxurl,{action:"speaker_adding",content:content.val(),key:key}).done(function(data){if($(data).hasClass('mec-error')){list.prepend(data);setTimeout(function(){$('#mec-speaker-error-${key}').remove();},1500);}else{list.html(data);content.val('');}
$($this).prop("disabled",false).css('cursor','pointer');});});var owl_rtl=$('body').hasClass('rtl')?true:false;var fes_export_list=$('.mec-export-list-wrapper');fes_export_list.find('.mec-export-list-item').click(function()
{$('.mec-export-list-item').removeClass('fes-export-date-active');$(this).addClass('fes-export-date-active');});var mec_bd_attendees_modules=$('.mec-attendees-list-details > ul > li');mec_bd_attendees_modules.click(function()
{$(this).find('.mec-attendees-toggle').toggle();});$('.mec-event-export-csv, .mec-event-export-excel').click(function()
{var mec_event_id=$(this).parent().parent().data('event-id');var booking_data=$(this).parent().parent().find('.mec-fes-btn-date .mec-certain-user-booking-ids').val();var certain_data=$(this).parent().parent().find('.fes-export-date-active').data('ids');if(typeof booking_data=='undefined')booking_data=',';if(typeof certain_data!='undefined')booking_data=certain_data;booking_data=booking_data.substr(0,booking_data.length-1);$.ajax({url:mecdata.ajax_url,data:"action=mec_fes_csv_export&fes_nonce="+mecdata.fes_nonce+"&mec_event_id="+mec_event_id+"&booking_ids="+booking_data,dataType:'json',type:"post",success:function(res){if(res.ex!='error')
{var $csv=$('<a>');$csv.attr('href',res.ex);$('body').append($csv);$csv.attr('download','bookings-'+res.name+'.csv');$csv[0].click();$csv.remove();}},error:function(){}});});});})(jQuery);function mec_book_form_submit(event,unique_id)
{event.preventDefault();window["mec_book_form_submit"+unique_id]();}
function mec_book_form_back_btn_cache(context,unique_id)
{var id=jQuery(context).attr('id');var mec_form_data=jQuery('#mec_book_form'+unique_id).serializeArray();if(id=="mec-book-form-btn-step-1")jQuery('body').data('mec-book-form-step-1',jQuery('#mec_booking'+unique_id).html()).data('unique-id',unique_id).data('mec-book-form-data-step-1',mec_form_data);else if(id=="mec-book-form-btn-step-2")jQuery('body').data('mec-book-form-step-2',jQuery('#mec_booking'+unique_id).html()).data('mec-book-form-data-step-2',mec_form_data);}
function mec_agreement_change(context)
{var status=jQuery(context).is(":checked")?true:false;if(status)jQuery(context).attr("checked","checked");else jQuery(context).removeAttr("checked");}
function mec_book_form_back_btn_click(context,unique_id)
{var id=jQuery(context).attr('id');unique_id=jQuery('body').data('unique-id');jQuery('#mec_booking_message'+unique_id).hide();if(id=="mec-book-form-back-btn-step-2")
{var mec_form_data_step_1=jQuery('body').data('mec-book-form-data-step-1');jQuery('#mec_booking'+unique_id).html(jQuery('body').data('mec-book-form-step-1'));jQuery.each(mec_form_data_step_1,function(index,object_item)
{jQuery('[name="'+object_item.name+'"]').val(object_item.value);});var recaptcha_check=jQuery('#mec_booking'+unique_id).find('#g-recaptcha').length;if(recaptcha_check!=0)
{jQuery('#g-recaptcha').html('');grecaptcha.render("g-recaptcha",{sitekey:mecdata.recapcha_key});}}
else if(id=="mec-book-form-back-btn-step-3")
{var mec_form_data_step_2=jQuery('body').data('mec-book-form-data-step-2');jQuery('#mec_booking'+unique_id).html(jQuery('body').data('mec-book-form-step-2'));jQuery.each(mec_form_data_step_2,function(index,object_item)
{var mec_elem=jQuery('[name="'+object_item.name+'"]');var mec_type=mec_elem.attr('type');if((mec_type=='checkbox'||mec_type=='radio'))
{var mec_elem_len=jQuery('[name="'+object_item.name+'"]').length;if(mec_elem_len>1)
{var id='#'+mec_elem.attr('id').match(/mec_book_reg_field_reg.*_/g)+object_item.value.toLowerCase();jQuery(id).prop('checked',true);}
else
{mec_elem.prop('checked',true);}}
mec_elem.val(object_item.value);});}}
function gmapSkin(NewJson){var gmap_temp=jQuery("#gmap-data");var beforeJson=gmap_temp.val();if(typeof beforeJson==='undefined')beforeJson='';var newJson=NewJson;var jsonPush=(typeof beforeJson!='undefined'&&beforeJson.trim()=="")?[]:JSON.parse(beforeJson);var pushState=jsonPush.length<1?false:true;for(var key in newJson){if(pushState){jsonPush.forEach(function(Item,Index){var render_location=jsonPush[Index].latitude+","+jsonPush[Index].longitude;if(key.trim()==render_location.trim()){newJson[key].count=newJson[key].count+jsonPush[Index].count;newJson[key].event_ids=newJson[key].event_ids.concat(jsonPush[Index].event_ids);var dom=jQuery(newJson[key].lightbox).find("div:nth-child(2)");var main_items=dom.html();var new_items=jQuery(jsonPush[Index].lightbox).find("div:nth-child(2)").html();var render_items=dom.html(main_items+new_items).html();var new_info_lightbox='<div><div class="mec-event-detail mec-map-view-event-detail"><i class="mec-sl-map-marker"></i> '+newJson[key].name+'</div><div>'+render_items+'</div></div>';newJson[key].lightbox=new_info_lightbox;var new_info_window='<div class="mec-marker-infowindow-wp"><div class="mec-marker-infowindow-count">'+newJson[key].count+'</div><div class="mec-marker-infowindow-content"><span>Event at this location</span><span>'+newJson[key].name+'</span></div></div>';newJson[key].infowindow=new_info_window;jsonPush.splice(Index,1);}});}
jsonPush.push(newJson[key]);}
gmap_temp.val(JSON.stringify(jsonPush));return jsonPush;};
/*! tooltipster v4.2.6 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof exports?module.exports=b(require("jquery")):b(jQuery)}(this,function(a){function b(a){this.$container,this.constraints=null,this.__$tooltip,this.__init(a)}function c(b,c){var d=!0;return a.each(b,function(a,e){return void 0===c[a]||b[a]!==c[a]?(d=!1,!1):void 0}),d}function d(b){var c=b.attr("id"),d=c?h.window.document.getElementById(c):null;return d?d===b[0]:a.contains(h.window.document.body,b[0])}function e(){if(!g)return!1;var a=g.document.body||g.document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}var f={animation:"fade",animationDuration:350,content:null,contentAsHTML:!1,contentCloning:!1,debug:!0,delay:300,delayTouch:[300,500],functionInit:null,functionBefore:null,functionReady:null,functionAfter:null,functionFormat:null,IEmin:6,interactive:!1,multiple:!1,parent:null,plugins:["sideTip"],repositionOnScroll:!1,restoration:"none",selfDestruction:!0,theme:[],timer:0,trackerInterval:500,trackOrigin:!1,trackTooltip:!1,trigger:"hover",triggerClose:{click:!1,mouseleave:!1,originClick:!1,scroll:!1,tap:!1,touchleave:!1},triggerOpen:{click:!1,mouseenter:!1,tap:!1,touchstart:!1},updateAnimation:"rotate",zIndex:9999999},g="undefined"!=typeof window?window:null,h={hasTouchCapability:!(!g||!("ontouchstart"in g||g.DocumentTouch&&g.document instanceof g.DocumentTouch||g.navigator.maxTouchPoints)),hasTransitions:e(),IE:!1,semVer:"4.2.6",window:g},i=function(){this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__instancesLatestArr=[],this.__plugins={},this._env=h};i.prototype={__bridge:function(b,c,d){if(!c[d]){var e=function(){};e.prototype=b;var g=new e;g.__init&&g.__init(c),a.each(b,function(a,b){0!=a.indexOf("__")&&(c[a]?f.debug&&console.log("The "+a+" method of the "+d+" plugin conflicts with another plugin or native methods"):(c[a]=function(){return g[a].apply(g,Array.prototype.slice.apply(arguments))},c[a].bridged=g))}),c[d]=g}return this},__setWindow:function(a){return h.window=a,this},_getRuler:function(a){return new b(a)},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_plugin:function(b){var c=this;if("string"==typeof b){var d=b,e=null;return d.indexOf(".")>0?e=c.__plugins[d]:a.each(c.__plugins,function(a,b){return b.name.substring(b.name.length-d.length-1)=="."+d?(e=b,!1):void 0}),e}if(b.name.indexOf(".")<0)throw new Error("Plugins must be namespaced");return c.__plugins[b.name]=b,b.core&&c.__bridge(b.core,c,b.name),this},_trigger:function(){var a=Array.prototype.slice.apply(arguments);return"string"==typeof a[0]&&(a[0]={type:a[0]}),this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,a),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,a),this},instances:function(b){var c=[],d=b||".tooltipstered";return a(d).each(function(){var b=a(this),d=b.data("tooltipster-ns");d&&a.each(d,function(a,d){c.push(b.data(d))})}),c},instancesLatest:function(){return this.__instancesLatestArr},off:function(){return this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},origins:function(b){var c=b?b+" ":"";return a(c+".tooltipstered").toArray()},setDefaults:function(b){return a.extend(f,b),this},triggerHandler:function(){return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.tooltipster=new i,a.Tooltipster=function(b,c){this.__callbacks={close:[],open:[]},this.__closingTime,this.__Content,this.__contentBcr,this.__destroyed=!1,this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__enabled=!0,this.__garbageCollector,this.__Geometry,this.__lastPosition,this.__namespace="tooltipster-"+Math.round(1e6*Math.random()),this.__options,this.__$originParents,this.__pointerIsOverOrigin=!1,this.__previousThemes=[],this.__state="closed",this.__timeouts={close:[],open:null},this.__touchEvents=[],this.__tracker=null,this._$origin,this._$tooltip,this.__init(b,c)},a.Tooltipster.prototype={__init:function(b,c){var d=this;if(d._$origin=a(b),d.__options=a.extend(!0,{},f,c),d.__optionsFormat(),!h.IE||h.IE>=d.__options.IEmin){var e=null;if(void 0===d._$origin.data("tooltipster-initialTitle")&&(e=d._$origin.attr("title"),void 0===e&&(e=null),d._$origin.data("tooltipster-initialTitle",e)),null!==d.__options.content)d.__contentSet(d.__options.content);else{var g,i=d._$origin.attr("data-tooltip-content");i&&(g=a(i)),g&&g[0]?d.__contentSet(g.first()):d.__contentSet(e)}d._$origin.removeAttr("title").addClass("tooltipstered"),d.__prepareOrigin(),d.__prepareGC(),a.each(d.__options.plugins,function(a,b){d._plug(b)}),h.hasTouchCapability&&a(h.window.document.body).on("touchmove."+d.__namespace+"-triggerOpen",function(a){d._touchRecordEvent(a)}),d._on("created",function(){d.__prepareTooltip()})._on("repositioned",function(a){d.__lastPosition=a.position})}else d.__options.disabled=!0},__contentInsert:function(){var a=this,b=a._$tooltip.find(".tooltipster-content"),c=a.__Content,d=function(a){c=a};return a._trigger({type:"format",content:a.__Content,format:d}),a.__options.functionFormat&&(c=a.__options.functionFormat.call(a,a,{origin:a._$origin[0]},a.__Content)),"string"!=typeof c||a.__options.contentAsHTML?b.empty().append(c):b.text(c),a},__contentSet:function(b){return b instanceof a&&this.__options.contentCloning&&(b=b.clone(!0)),this.__Content=b,this._trigger({type:"updated",content:b}),this},__destroyError:function(){throw new Error("This tooltip has been destroyed and cannot execute your method call.")},__geometry:function(){var b=this,c=b._$origin,d=b._$origin.is("area");if(d){var e=b._$origin.parent().attr("name");c=a('img[usemap="#'+e+'"]')}var f=c[0].getBoundingClientRect(),g=a(h.window.document),i=a(h.window),j=c,k={available:{document:null,window:null},document:{size:{height:g.height(),width:g.width()}},window:{scroll:{left:h.window.scrollX||h.window.document.documentElement.scrollLeft,top:h.window.scrollY||h.window.document.documentElement.scrollTop},size:{height:i.height(),width:i.width()}},origin:{fixedLineage:!1,offset:{},size:{height:f.bottom-f.top,width:f.right-f.left},usemapImage:d?c[0]:null,windowOffset:{bottom:f.bottom,left:f.left,right:f.right,top:f.top}}};if(d){var l=b._$origin.attr("shape"),m=b._$origin.attr("coords");if(m&&(m=m.split(","),a.map(m,function(a,b){m[b]=parseInt(a)})),"default"!=l)switch(l){case"circle":var n=m[0],o=m[1],p=m[2],q=o-p,r=n-p;k.origin.size.height=2*p,k.origin.size.width=k.origin.size.height,k.origin.windowOffset.left+=r,k.origin.windowOffset.top+=q;break;case"rect":var s=m[0],t=m[1],u=m[2],v=m[3];k.origin.size.height=v-t,k.origin.size.width=u-s,k.origin.windowOffset.left+=s,k.origin.windowOffset.top+=t;break;case"poly":for(var w=0,x=0,y=0,z=0,A="even",B=0;B<m.length;B++){var C=m[B];"even"==A?(C>y&&(y=C,0===B&&(w=y)),w>C&&(w=C),A="odd"):(C>z&&(z=C,1==B&&(x=z)),x>C&&(x=C),A="even")}k.origin.size.height=z-x,k.origin.size.width=y-w,k.origin.windowOffset.left+=w,k.origin.windowOffset.top+=x}}var D=function(a){k.origin.size.height=a.height,k.origin.windowOffset.left=a.left,k.origin.windowOffset.top=a.top,k.origin.size.width=a.width};for(b._trigger({type:"geometry",edit:D,geometry:{height:k.origin.size.height,left:k.origin.windowOffset.left,top:k.origin.windowOffset.top,width:k.origin.size.width}}),k.origin.windowOffset.right=k.origin.windowOffset.left+k.origin.size.width,k.origin.windowOffset.bottom=k.origin.windowOffset.top+k.origin.size.height,k.origin.offset.left=k.origin.windowOffset.left+k.window.scroll.left,k.origin.offset.top=k.origin.windowOffset.top+k.window.scroll.top,k.origin.offset.bottom=k.origin.offset.top+k.origin.size.height,k.origin.offset.right=k.origin.offset.left+k.origin.size.width,k.available.document={bottom:{height:k.document.size.height-k.origin.offset.bottom,width:k.document.size.width},left:{height:k.document.size.height,width:k.origin.offset.left},right:{height:k.document.size.height,width:k.document.size.width-k.origin.offset.right},top:{height:k.origin.offset.top,width:k.document.size.width}},k.available.window={bottom:{height:Math.max(k.window.size.height-Math.max(k.origin.windowOffset.bottom,0),0),width:k.window.size.width},left:{height:k.window.size.height,width:Math.max(k.origin.windowOffset.left,0)},right:{height:k.window.size.height,width:Math.max(k.window.size.width-Math.max(k.origin.windowOffset.right,0),0)},top:{height:Math.max(k.origin.windowOffset.top,0),width:k.window.size.width}};"html"!=j[0].tagName.toLowerCase();){if("fixed"==j.css("position")){k.origin.fixedLineage=!0;break}j=j.parent()}return k},__optionsFormat:function(){return"number"==typeof this.__options.animationDuration&&(this.__options.animationDuration=[this.__options.animationDuration,this.__options.animationDuration]),"number"==typeof this.__options.delay&&(this.__options.delay=[this.__options.delay,this.__options.delay]),"number"==typeof this.__options.delayTouch&&(this.__options.delayTouch=[this.__options.delayTouch,this.__options.delayTouch]),"string"==typeof this.__options.theme&&(this.__options.theme=[this.__options.theme]),null===this.__options.parent?this.__options.parent=a(h.window.document.body):"string"==typeof this.__options.parent&&(this.__options.parent=a(this.__options.parent)),"hover"==this.__options.trigger?(this.__options.triggerOpen={mouseenter:!0,touchstart:!0},this.__options.triggerClose={mouseleave:!0,originClick:!0,touchleave:!0}):"click"==this.__options.trigger&&(this.__options.triggerOpen={click:!0,tap:!0},this.__options.triggerClose={click:!0,tap:!0}),this._trigger("options"),this},__prepareGC:function(){var b=this;return b.__options.selfDestruction?b.__garbageCollector=setInterval(function(){var c=(new Date).getTime();b.__touchEvents=a.grep(b.__touchEvents,function(a,b){return c-a.time>6e4}),d(b._$origin)||b.close(function(){b.destroy()})},2e4):clearInterval(b.__garbageCollector),b},__prepareOrigin:function(){var a=this;if(a._$origin.off("."+a.__namespace+"-triggerOpen"),h.hasTouchCapability&&a._$origin.on("touchstart."+a.__namespace+"-triggerOpen touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen",function(b){a._touchRecordEvent(b)}),a.__options.triggerOpen.click||a.__options.triggerOpen.tap&&h.hasTouchCapability){var b="";a.__options.triggerOpen.click&&(b+="click."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.tap&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&a._open(b)})}if(a.__options.triggerOpen.mouseenter||a.__options.triggerOpen.touchstart&&h.hasTouchCapability){var b="";a.__options.triggerOpen.mouseenter&&(b+="mouseenter."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.touchstart&&h.hasTouchCapability&&(b+="touchstart."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){!a._touchIsTouchEvent(b)&&a._touchIsEmulatedEvent(b)||(a.__pointerIsOverOrigin=!0,a._openShortly(b))})}if(a.__options.triggerClose.mouseleave||a.__options.triggerClose.touchleave&&h.hasTouchCapability){var b="";a.__options.triggerClose.mouseleave&&(b+="mouseleave."+a.__namespace+"-triggerOpen "),a.__options.triggerClose.touchleave&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&(a.__pointerIsOverOrigin=!1)})}return a},__prepareTooltip:function(){var b=this,c=b.__options.interactive?"auto":"";return b._$tooltip.attr("id",b.__namespace).css({"pointer-events":c,zIndex:b.__options.zIndex}),a.each(b.__previousThemes,function(a,c){b._$tooltip.removeClass(c)}),a.each(b.__options.theme,function(a,c){b._$tooltip.addClass(c)}),b.__previousThemes=a.merge([],b.__options.theme),b},__scrollHandler:function(b){var c=this;if(c.__options.triggerClose.scroll)c._close(b);else if(d(c._$origin)&&d(c._$tooltip)){var e=null;if(b.target===h.window.document)c.__Geometry.origin.fixedLineage||c.__options.repositionOnScroll&&c.reposition(b);else{e=c.__geometry();var f=!1;if("fixed"!=c._$origin.css("position")&&c.__$originParents.each(function(b,c){var d=a(c),g=d.css("overflow-x"),h=d.css("overflow-y");if("visible"!=g||"visible"!=h){var i=c.getBoundingClientRect();if("visible"!=g&&(e.origin.windowOffset.left<i.left||e.origin.windowOffset.right>i.right))return f=!0,!1;if("visible"!=h&&(e.origin.windowOffset.top<i.top||e.origin.windowOffset.bottom>i.bottom))return f=!0,!1}return"fixed"==d.css("position")?!1:void 0}),f)c._$tooltip.css("visibility","hidden");else if(c._$tooltip.css("visibility","visible"),c.__options.repositionOnScroll)c.reposition(b);else{var g=e.origin.offset.left-c.__Geometry.origin.offset.left,i=e.origin.offset.top-c.__Geometry.origin.offset.top;c._$tooltip.css({left:c.__lastPosition.coord.left+g,top:c.__lastPosition.coord.top+i})}}c._trigger({type:"scroll",event:b,geo:e})}return c},__stateSet:function(a){return this.__state=a,this._trigger({type:"state",state:a}),this},__timeoutsClear:function(){return clearTimeout(this.__timeouts.open),this.__timeouts.open=null,a.each(this.__timeouts.close,function(a,b){clearTimeout(b)}),this.__timeouts.close=[],this},__trackerStart:function(){var a=this,b=a._$tooltip.find(".tooltipster-content");return a.__options.trackTooltip&&(a.__contentBcr=b[0].getBoundingClientRect()),a.__tracker=setInterval(function(){if(d(a._$origin)&&d(a._$tooltip)){if(a.__options.trackOrigin){var e=a.__geometry(),f=!1;c(e.origin.size,a.__Geometry.origin.size)&&(a.__Geometry.origin.fixedLineage?c(e.origin.windowOffset,a.__Geometry.origin.windowOffset)&&(f=!0):c(e.origin.offset,a.__Geometry.origin.offset)&&(f=!0)),f||(a.__options.triggerClose.mouseleave?a._close():a.reposition())}if(a.__options.trackTooltip){var g=b[0].getBoundingClientRect();g.height===a.__contentBcr.height&&g.width===a.__contentBcr.width||(a.reposition(),a.__contentBcr=g)}}else a._close()},a.__options.trackerInterval),a},_close:function(b,c,d){var e=this,f=!0;if(e._trigger({type:"close",event:b,stop:function(){f=!1}}),f||d){c&&e.__callbacks.close.push(c),e.__callbacks.open=[],e.__timeoutsClear();var g=function(){a.each(e.__callbacks.close,function(a,c){c.call(e,e,{event:b,origin:e._$origin[0]})}),e.__callbacks.close=[]};if("closed"!=e.__state){var i=!0,j=new Date,k=j.getTime(),l=k+e.__options.animationDuration[1];if("disappearing"==e.__state&&l>e.__closingTime&&e.__options.animationDuration[1]>0&&(i=!1),i){e.__closingTime=l,"disappearing"!=e.__state&&e.__stateSet("disappearing");var m=function(){clearInterval(e.__tracker),e._trigger({type:"closing",event:b}),e._$tooltip.off("."+e.__namespace+"-triggerClose").removeClass("tooltipster-dying"),a(h.window).off("."+e.__namespace+"-triggerClose"),e.__$originParents.each(function(b,c){a(c).off("scroll."+e.__namespace+"-triggerClose")}),e.__$originParents=null,a(h.window.document.body).off("."+e.__namespace+"-triggerClose"),e._$origin.off("."+e.__namespace+"-triggerClose"),e._off("dismissable"),e.__stateSet("closed"),e._trigger({type:"after",event:b}),e.__options.functionAfter&&e.__options.functionAfter.call(e,e,{event:b,origin:e._$origin[0]}),g()};h.hasTransitions?(e._$tooltip.css({"-moz-animation-duration":e.__options.animationDuration[1]+"ms","-ms-animation-duration":e.__options.animationDuration[1]+"ms","-o-animation-duration":e.__options.animationDuration[1]+"ms","-webkit-animation-duration":e.__options.animationDuration[1]+"ms","animation-duration":e.__options.animationDuration[1]+"ms","transition-duration":e.__options.animationDuration[1]+"ms"}),e._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"),e.__options.animationDuration[1]>0&&e._$tooltip.delay(e.__options.animationDuration[1]),e._$tooltip.queue(m)):e._$tooltip.stop().fadeOut(e.__options.animationDuration[1],m)}}else g()}return e},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_open:function(b,c){var e=this;if(!e.__destroying&&d(e._$origin)&&e.__enabled){var f=!0;if("closed"==e.__state&&(e._trigger({type:"before",event:b,stop:function(){f=!1}}),f&&e.__options.functionBefore&&(f=e.__options.functionBefore.call(e,e,{event:b,origin:e._$origin[0]}))),f!==!1&&null!==e.__Content){c&&e.__callbacks.open.push(c),e.__callbacks.close=[],e.__timeoutsClear();var g,i=function(){"stable"!=e.__state&&e.__stateSet("stable"),a.each(e.__callbacks.open,function(a,b){b.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}),e.__callbacks.open=[]};if("closed"!==e.__state)g=0,"disappearing"===e.__state?(e.__stateSet("appearing"),h.hasTransitions?(e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i)):e._$tooltip.stop().fadeIn(i)):"stable"==e.__state&&i();else{if(e.__stateSet("appearing"),g=e.__options.animationDuration[0],e.__contentInsert(),e.reposition(b,!0),h.hasTransitions?(e._$tooltip.addClass("tooltipster-"+e.__options.animation).addClass("tooltipster-initial").css({"-moz-animation-duration":e.__options.animationDuration[0]+"ms","-ms-animation-duration":e.__options.animationDuration[0]+"ms","-o-animation-duration":e.__options.animationDuration[0]+"ms","-webkit-animation-duration":e.__options.animationDuration[0]+"ms","animation-duration":e.__options.animationDuration[0]+"ms","transition-duration":e.__options.animationDuration[0]+"ms"}),setTimeout(function(){"closed"!=e.__state&&(e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i))},0)):e._$tooltip.css("display","none").fadeIn(e.__options.animationDuration[0],i),e.__trackerStart(),a(h.window).on("resize."+e.__namespace+"-triggerClose",function(b){var c=a(document.activeElement);(c.is("input")||c.is("textarea"))&&a.contains(e._$tooltip[0],c[0])||e.reposition(b)}).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)}),e.__$originParents=e._$origin.parents(),e.__$originParents.each(function(b,c){a(c).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)})}),e.__options.triggerClose.mouseleave||e.__options.triggerClose.touchleave&&h.hasTouchCapability){e._on("dismissable",function(a){a.dismissable?a.delay?(m=setTimeout(function(){e._close(a.event)},a.delay),e.__timeouts.close.push(m)):e._close(a):clearTimeout(m)});var j=e._$origin,k="",l="",m=null;e.__options.interactive&&(j=j.add(e._$tooltip)),e.__options.triggerClose.mouseleave&&(k+="mouseenter."+e.__namespace+"-triggerClose ",l+="mouseleave."+e.__namespace+"-triggerClose "),e.__options.triggerClose.touchleave&&h.hasTouchCapability&&(k+="touchstart."+e.__namespace+"-triggerClose",l+="touchend."+e.__namespace+"-triggerClose touchcancel."+e.__namespace+"-triggerClose"),j.on(l,function(a){if(e._touchIsTouchEvent(a)||!e._touchIsEmulatedEvent(a)){var b="mouseleave"==a.type?e.__options.delay:e.__options.delayTouch;e._trigger({delay:b[1],dismissable:!0,event:a,type:"dismissable"})}}).on(k,function(a){!e._touchIsTouchEvent(a)&&e._touchIsEmulatedEvent(a)||e._trigger({dismissable:!1,event:a,type:"dismissable"})})}e.__options.triggerClose.originClick&&e._$origin.on("click."+e.__namespace+"-triggerClose",function(a){e._touchIsTouchEvent(a)||e._touchIsEmulatedEvent(a)||e._close(a)}),(e.__options.triggerClose.click||e.__options.triggerClose.tap&&h.hasTouchCapability)&&setTimeout(function(){if("closed"!=e.__state){var b="",c=a(h.window.document.body);e.__options.triggerClose.click&&(b+="click."+e.__namespace+"-triggerClose "),e.__options.triggerClose.tap&&h.hasTouchCapability&&(b+="touchend."+e.__namespace+"-triggerClose"),c.on(b,function(b){e._touchIsMeaningfulEvent(b)&&(e._touchRecordEvent(b),e.__options.interactive&&a.contains(e._$tooltip[0],b.target)||e._close(b))}),e.__options.triggerClose.tap&&h.hasTouchCapability&&c.on("touchstart."+e.__namespace+"-triggerClose",function(a){e._touchRecordEvent(a)})}},0),e._trigger("ready"),e.__options.functionReady&&e.__options.functionReady.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}if(e.__options.timer>0){var m=setTimeout(function(){e._close()},e.__options.timer+g);e.__timeouts.close.push(m)}}}return e},_openShortly:function(a){var b=this,c=!0;if("stable"!=b.__state&&"appearing"!=b.__state&&!b.__timeouts.open&&(b._trigger({type:"start",event:a,stop:function(){c=!1}}),c)){var d=0==a.type.indexOf("touch")?b.__options.delayTouch:b.__options.delay;d[0]?b.__timeouts.open=setTimeout(function(){b.__timeouts.open=null,b.__pointerIsOverOrigin&&b._touchIsMeaningfulEvent(a)?(b._trigger("startend"),b._open(a)):b._trigger("startcancel")},d[0]):(b._trigger("startend"),b._open(a))}return b},_optionsExtract:function(b,c){var d=this,e=a.extend(!0,{},c),f=d.__options[b];return f||(f={},a.each(c,function(a,b){var c=d.__options[a];void 0!==c&&(f[a]=c)})),a.each(e,function(b,c){void 0!==f[b]&&("object"!=typeof c||c instanceof Array||null==c||"object"!=typeof f[b]||f[b]instanceof Array||null==f[b]?e[b]=f[b]:a.extend(e[b],f[b]))}),e},_plug:function(b){var c=a.tooltipster._plugin(b);if(!c)throw new Error('The "'+b+'" plugin is not defined');return c.instance&&a.tooltipster.__bridge(c.instance,this,c.name),this},_touchIsEmulatedEvent:function(a){for(var b=!1,c=(new Date).getTime(),d=this.__touchEvents.length-1;d>=0;d--){var e=this.__touchEvents[d];if(!(c-e.time<500))break;e.target===a.target&&(b=!0)}return b},_touchIsMeaningfulEvent:function(a){return this._touchIsTouchEvent(a)&&!this._touchSwiped(a.target)||!this._touchIsTouchEvent(a)&&!this._touchIsEmulatedEvent(a)},_touchIsTouchEvent:function(a){return 0==a.type.indexOf("touch")},_touchRecordEvent:function(a){return this._touchIsTouchEvent(a)&&(a.time=(new Date).getTime(),this.__touchEvents.push(a)),this},_touchSwiped:function(a){for(var b=!1,c=this.__touchEvents.length-1;c>=0;c--){var d=this.__touchEvents[c];if("touchmove"==d.type){b=!0;break}if("touchstart"==d.type&&a===d.target)break}return b},_trigger:function(){var b=Array.prototype.slice.apply(arguments);return"string"==typeof b[0]&&(b[0]={type:b[0]}),b[0].instance=this,b[0].origin=this._$origin?this._$origin[0]:null,b[0].tooltip=this._$tooltip?this._$tooltip[0]:null,this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,b),a.tooltipster._trigger.apply(a.tooltipster,b),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,b),this},_unplug:function(b){var c=this;if(c[b]){var d=a.tooltipster._plugin(b);d.instance&&a.each(d.instance,function(a,d){c[a]&&c[a].bridged===c[b]&&delete c[a]}),c[b].__destroy&&c[b].__destroy(),delete c[b]}return c},close:function(a){return this.__destroyed?this.__destroyError():this._close(null,a),this},content:function(a){var b=this;if(void 0===a)return b.__Content;if(b.__destroyed)b.__destroyError();else if(b.__contentSet(a),null!==b.__Content){if("closed"!==b.__state&&(b.__contentInsert(),b.reposition(),b.__options.updateAnimation))if(h.hasTransitions){var c=b.__options.updateAnimation;b._$tooltip.addClass("tooltipster-update-"+c),setTimeout(function(){"closed"!=b.__state&&b._$tooltip.removeClass("tooltipster-update-"+c)},1e3)}else b._$tooltip.fadeTo(200,.5,function(){"closed"!=b.__state&&b._$tooltip.fadeTo(200,1)})}else b._close();return b},destroy:function(){var b=this;if(b.__destroyed)b.__destroyError();else{"closed"!=b.__state?b.option("animationDuration",0)._close(null,null,!0):b.__timeoutsClear(),b._trigger("destroy"),b.__destroyed=!0,b._$origin.removeData(b.__namespace).off("."+b.__namespace+"-triggerOpen"),a(h.window.document.body).off("."+b.__namespace+"-triggerOpen");var c=b._$origin.data("tooltipster-ns");if(c)if(1===c.length){var d=null;"previous"==b.__options.restoration?d=b._$origin.data("tooltipster-initialTitle"):"current"==b.__options.restoration&&(d="string"==typeof b.__Content?b.__Content:a("<div></div>").append(b.__Content).html()),d&&b._$origin.attr("title",d),b._$origin.removeClass("tooltipstered"),b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")}else c=a.grep(c,function(a,c){return a!==b.__namespace}),b._$origin.data("tooltipster-ns",c);b._trigger("destroyed"),b._off(),b.off(),b.__Content=null,b.__$emitterPrivate=null,b.__$emitterPublic=null,b.__options.parent=null,b._$origin=null,b._$tooltip=null,a.tooltipster.__instancesLatestArr=a.grep(a.tooltipster.__instancesLatestArr,function(a,c){return b!==a}),clearInterval(b.__garbageCollector)}return b},disable:function(){return this.__destroyed?(this.__destroyError(),this):(this._close(),this.__enabled=!1,this)},elementOrigin:function(){return this.__destroyed?void this.__destroyError():this._$origin[0]},elementTooltip:function(){return this._$tooltip?this._$tooltip[0]:null},enable:function(){return this.__enabled=!0,this},hide:function(a){return this.close(a)},instance:function(){return this},off:function(){return this.__destroyed||this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},open:function(a){return this.__destroyed?this.__destroyError():this._open(null,a),this},option:function(b,c){return void 0===c?this.__options[b]:(this.__destroyed?this.__destroyError():(this.__options[b]=c,this.__optionsFormat(),a.inArray(b,["trigger","triggerClose","triggerOpen"])>=0&&this.__prepareOrigin(),"selfDestruction"===b&&this.__prepareGC()),this)},reposition:function(a,b){var c=this;return c.__destroyed?c.__destroyError():"closed"!=c.__state&&d(c._$origin)&&(b||d(c._$tooltip))&&(b||c._$tooltip.detach(),c.__Geometry=c.__geometry(),c._trigger({type:"reposition",event:a,helper:{geo:c.__Geometry}})),c},show:function(a){return this.open(a)},status:function(){return{destroyed:this.__destroyed,enabled:this.__enabled,open:"closed"!==this.__state,state:this.__state}},triggerHandler:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.fn.tooltipster=function(){var b=Array.prototype.slice.apply(arguments),c="You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";if(0===this.length)return this;if("string"==typeof b[0]){var d="#*$~&";return this.each(function(){var e=a(this).data("tooltipster-ns"),f=e?a(this).data(e[0]):null;if(!f)throw new Error("You called Tooltipster's \""+b[0]+'" method on an uninitialized element');if("function"!=typeof f[b[0]])throw new Error('Unknown method "'+b[0]+'"');this.length>1&&"content"==b[0]&&(b[1]instanceof a||"object"==typeof b[1]&&null!=b[1]&&b[1].tagName)&&!f.__options.contentCloning&&f.__options.debug&&console.log(c);var g=f[b[0]](b[1],b[2]);return g!==f||"instance"===b[0]?(d=g,!1):void 0}),"#*$~&"!==d?d:this}a.tooltipster.__instancesLatestArr=[];var e=b[0]&&void 0!==b[0].multiple,g=e&&b[0].multiple||!e&&f.multiple,h=b[0]&&void 0!==b[0].content,i=h&&b[0].content||!h&&f.content,j=b[0]&&void 0!==b[0].contentCloning,k=j&&b[0].contentCloning||!j&&f.contentCloning,l=b[0]&&void 0!==b[0].debug,m=l&&b[0].debug||!l&&f.debug;return this.length>1&&(i instanceof a||"object"==typeof i&&null!=i&&i.tagName)&&!k&&m&&console.log(c),this.each(function(){var c=!1,d=a(this),e=d.data("tooltipster-ns"),f=null;e?g?c=!0:m&&(console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."),console.log(this)):c=!0,c&&(f=new a.Tooltipster(this,b[0]),e||(e=[]),e.push(f.__namespace),d.data("tooltipster-ns",e),d.data(f.__namespace,f),f.__options.functionInit&&f.__options.functionInit.call(f,f,{origin:this}),f._trigger("init")),a.tooltipster.__instancesLatestArr.push(f)}),this},b.prototype={__init:function(b){this.__$tooltip=b,this.__$tooltip.css({left:0,overflow:"hidden",position:"absolute",top:0}).find(".tooltipster-content").css("overflow","auto"),this.$container=a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo(h.window.document.body)},__forceRedraw:function(){var a=this.__$tooltip.parent();this.__$tooltip.detach(),this.__$tooltip.appendTo(a)},constrain:function(a,b){return this.constraints={width:a,height:b},this.__$tooltip.css({display:"block",height:"",overflow:"auto",width:a}),this},destroy:function(){this.__$tooltip.detach().find(".tooltipster-content").css({display:"",overflow:""}),this.$container.remove()},free:function(){return this.constraints=null,this.__$tooltip.css({display:"",height:"",overflow:"visible",width:""}),this},measure:function(){this.__forceRedraw();var a=this.__$tooltip[0].getBoundingClientRect(),b={size:{height:a.height||a.bottom-a.top,width:a.width||a.right-a.left}};if(this.constraints){var c=this.__$tooltip.find(".tooltipster-content"),d=this.__$tooltip.outerHeight(),e=c[0].getBoundingClientRect(),f={height:d<=this.constraints.height,width:a.width<=this.constraints.width&&e.width>=c[0].scrollWidth-1};b.fits=f.height&&f.width}return h.IE&&h.IE<=11&&b.size.width!==h.window.document.documentElement.clientWidth&&(b.size.width=Math.ceil(b.size.width)+1),b}};var j=navigator.userAgent.toLowerCase();-1!=j.indexOf("msie")?h.IE=parseInt(j.split("msie")[1]):-1!==j.toLowerCase().indexOf("trident")&&-1!==j.indexOf(" rv:11")?h.IE=11:-1!=j.toLowerCase().indexOf("edge/")&&(h.IE=parseInt(j.toLowerCase().split("edge/")[1]));var k="tooltipster.sideTip";return a.tooltipster._plugin({name:k,instance:{__defaults:function(){return{arrow:!0,distance:6,functionPosition:null,maxWidth:null,minIntersection:16,minWidth:0,position:null,side:"top",viewportAware:!0}},__init:function(a){var b=this;b.__instance=a,b.__namespace="tooltipster-sideTip-"+Math.round(1e6*Math.random()),b.__previousState="closed",b.__options,b.__optionsFormat(),b.__instance._on("state."+b.__namespace,function(a){"closed"==a.state?b.__close():"appearing"==a.state&&"closed"==b.__previousState&&b.__create(),b.__previousState=a.state}),b.__instance._on("options."+b.__namespace,function(){b.__optionsFormat()}),b.__instance._on("reposition."+b.__namespace,function(a){b.__reposition(a.event,a.helper)})},__close:function(){this.__instance.content()instanceof a&&this.__instance.content().detach(),this.__instance._$tooltip.remove(),this.__instance._$tooltip=null},__create:function(){var b=a('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');this.__options.arrow||b.find(".tooltipster-box").css("margin",0).end().find(".tooltipster-arrow").hide(),this.__options.minWidth&&b.css("min-width",this.__options.minWidth+"px"),this.__options.maxWidth&&b.css("max-width",this.__options.maxWidth+"px"),this.__instance._$tooltip=b,this.__instance._trigger("created")},__destroy:function(){this.__instance._off("."+self.__namespace)},__optionsFormat:function(){var b=this;if(b.__options=b.__instance._optionsExtract(k,b.__defaults()),b.__options.position&&(b.__options.side=b.__options.position),"object"!=typeof b.__options.distance&&(b.__options.distance=[b.__options.distance]),b.__options.distance.length<4&&(void 0===b.__options.distance[1]&&(b.__options.distance[1]=b.__options.distance[0]),void 0===b.__options.distance[2]&&(b.__options.distance[2]=b.__options.distance[0]),void 0===b.__options.distance[3]&&(b.__options.distance[3]=b.__options.distance[1]),b.__options.distance={top:b.__options.distance[0],right:b.__options.distance[1],bottom:b.__options.distance[2],left:b.__options.distance[3]}),"string"==typeof b.__options.side){var c={top:"bottom",right:"left",bottom:"top",left:"right"};b.__options.side=[b.__options.side,c[b.__options.side]],"left"==b.__options.side[0]||"right"==b.__options.side[0]?b.__options.side.push("top","bottom"):b.__options.side.push("right","left")}6===a.tooltipster._env.IE&&b.__options.arrow!==!0&&(b.__options.arrow=!1)},__reposition:function(b,c){var d,e=this,f=e.__targetFind(c),g=[];e.__instance._$tooltip.detach();var h=e.__instance._$tooltip.clone(),i=a.tooltipster._getRuler(h),j=!1,k=e.__instance.option("animation");switch(k&&h.removeClass("tooltipster-"+k),a.each(["window","document"],function(d,k){var l=null;if(e.__instance._trigger({container:k,helper:c,satisfied:j,takeTest:function(a){l=a},results:g,type:"positionTest"}),1==l||0!=l&&0==j&&("window"!=k||e.__options.viewportAware))for(var d=0;d<e.__options.side.length;d++){var m={horizontal:0,vertical:0},n=e.__options.side[d];"top"==n||"bottom"==n?m.vertical=e.__options.distance[n]:m.horizontal=e.__options.distance[n],e.__sideChange(h,n),a.each(["natural","constrained"],function(a,d){if(l=null,e.__instance._trigger({container:k,event:b,helper:c,mode:d,results:g,satisfied:j,side:n,takeTest:function(a){l=a},type:"positionTest"}),1==l||0!=l&&0==j){var h={container:k,distance:m,fits:null,mode:d,outerSize:null,side:n,size:null,target:f[n],whole:null},o="natural"==d?i.free():i.constrain(c.geo.available[k][n].width-m.horizontal,c.geo.available[k][n].height-m.vertical),p=o.measure();if(h.size=p.size,h.outerSize={height:p.size.height+m.vertical,width:p.size.width+m.horizontal},"natural"==d?c.geo.available[k][n].width>=h.outerSize.width&&c.geo.available[k][n].height>=h.outerSize.height?h.fits=!0:h.fits=!1:h.fits=p.fits,"window"==k&&(h.fits?"top"==n||"bottom"==n?h.whole=c.geo.origin.windowOffset.right>=e.__options.minIntersection&&c.geo.window.size.width-c.geo.origin.windowOffset.left>=e.__options.minIntersection:h.whole=c.geo.origin.windowOffset.bottom>=e.__options.minIntersection&&c.geo.window.size.height-c.geo.origin.windowOffset.top>=e.__options.minIntersection:h.whole=!1),g.push(h),h.whole)j=!0;else if("natural"==h.mode&&(h.fits||h.size.width<=c.geo.available[k][n].width))return!1}})}}),e.__instance._trigger({edit:function(a){g=a},event:b,helper:c,results:g,type:"positionTested"}),g.sort(function(a,b){if(a.whole&&!b.whole)return-1;if(!a.whole&&b.whole)return 1;if(a.whole&&b.whole){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}if(a.fits&&!b.fits)return-1;if(!a.fits&&b.fits)return 1;if(a.fits&&b.fits){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}return"document"==a.container&&"bottom"==a.side&&"natural"==a.mode?-1:1}),d=g[0],d.coord={},d.side){case"left":case"right":d.coord.top=Math.floor(d.target-d.size.height/2);break;case"bottom":case"top":d.coord.left=Math.floor(d.target-d.size.width/2)}switch(d.side){case"left":d.coord.left=c.geo.origin.windowOffset.left-d.outerSize.width;break;case"right":d.coord.left=c.geo.origin.windowOffset.right+d.distance.horizontal;break;case"top":d.coord.top=c.geo.origin.windowOffset.top-d.outerSize.height;break;case"bottom":d.coord.top=c.geo.origin.windowOffset.bottom+d.distance.vertical}"window"==d.container?"top"==d.side||"bottom"==d.side?d.coord.left<0?c.geo.origin.windowOffset.right-this.__options.minIntersection>=0?d.coord.left=0:d.coord.left=c.geo.origin.windowOffset.right-this.__options.minIntersection-1:d.coord.left>c.geo.window.size.width-d.size.width&&(c.geo.origin.windowOffset.left+this.__options.minIntersection<=c.geo.window.size.width?d.coord.left=c.geo.window.size.width-d.size.width:d.coord.left=c.geo.origin.windowOffset.left+this.__options.minIntersection+1-d.size.width):d.coord.top<0?c.geo.origin.windowOffset.bottom-this.__options.minIntersection>=0?d.coord.top=0:d.coord.top=c.geo.origin.windowOffset.bottom-this.__options.minIntersection-1:d.coord.top>c.geo.window.size.height-d.size.height&&(c.geo.origin.windowOffset.top+this.__options.minIntersection<=c.geo.window.size.height?d.coord.top=c.geo.window.size.height-d.size.height:d.coord.top=c.geo.origin.windowOffset.top+this.__options.minIntersection+1-d.size.height):(d.coord.left>c.geo.window.size.width-d.size.width&&(d.coord.left=c.geo.window.size.width-d.size.width),d.coord.left<0&&(d.coord.left=0)),e.__sideChange(h,d.side),c.tooltipClone=h[0],c.tooltipParent=e.__instance.option("parent").parent[0],c.mode=d.mode,c.whole=d.whole,c.origin=e.__instance._$origin[0],c.tooltip=e.__instance._$tooltip[0],delete d.container,delete d.fits,delete d.mode,delete d.outerSize,delete d.whole,d.distance=d.distance.horizontal||d.distance.vertical;var l=a.extend(!0,{},d);if(e.__instance._trigger({edit:function(a){d=a},event:b,helper:c,position:l,type:"position"}),e.__options.functionPosition){var m=e.__options.functionPosition.call(e,e.__instance,c,l);m&&(d=m)}i.destroy();var n,o;"top"==d.side||"bottom"==d.side?(n={prop:"left",val:d.target-d.coord.left},o=d.size.width-this.__options.minIntersection):(n={prop:"top",val:d.target-d.coord.top},o=d.size.height-this.__options.minIntersection),n.val<this.__options.minIntersection?n.val=this.__options.minIntersection:n.val>o&&(n.val=o);var p;p=c.geo.origin.fixedLineage?c.geo.origin.windowOffset:{left:c.geo.origin.windowOffset.left+c.geo.window.scroll.left,top:c.geo.origin.windowOffset.top+c.geo.window.scroll.top},d.coord={left:p.left+(d.coord.left-c.geo.origin.windowOffset.left),top:p.top+(d.coord.top-c.geo.origin.windowOffset.top)},e.__sideChange(e.__instance._$tooltip,d.side),c.geo.origin.fixedLineage?e.__instance._$tooltip.css("position","fixed"):e.__instance._$tooltip.css("position",""),e.__instance._$tooltip.css({left:d.coord.left,top:d.coord.top,height:d.size.height,width:d.size.width}).find(".tooltipster-arrow").css({left:"",top:""}).css(n.prop,n.val),e.__instance._$tooltip.appendTo(e.__instance.option("parent")),e.__instance._trigger({type:"repositioned",event:b,position:d})},__sideChange:function(a,b){a.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-"+b)},__targetFind:function(a){var b={},c=this.__instance._$origin[0].getClientRects();if(c.length>1){var d=this.__instance._$origin.css("opacity");1==d&&(this.__instance._$origin.css("opacity",.99),c=this.__instance._$origin[0].getClientRects(),this.__instance._$origin.css("opacity",1))}if(c.length<2)b.top=Math.floor(a.geo.origin.windowOffset.left+a.geo.origin.size.width/2),b.bottom=b.top,b.left=Math.floor(a.geo.origin.windowOffset.top+a.geo.origin.size.height/2),b.right=b.left;else{var e=c[0];b.top=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil(c.length/2)-1]:c[0],b.right=Math.floor(e.top+(e.bottom-e.top)/2),e=c[c.length-1],b.bottom=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil((c.length+1)/2)-1]:c[c.length-1],b.left=Math.floor(e.top+(e.bottom-e.top)/2)}return b}}}),a});;jQuery(document).ready(function($)
{$('.mec_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_thumbnail').val(attachment.attributes.url);$('.mec_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_thumbnail_img').html('');$('#mec_thumbnail').val('');$('.mec_remove_image_button').toggleClass('mec-util-hidden');});$('.mec_location_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_location_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_location_thumbnail').val(attachment.attributes.url);$('.mec_location_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_location_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_location_thumbnail_img').html('');$('#mec_location_thumbnail').val('');$('.mec_location_remove_image_button').toggleClass('mec-util-hidden');});$('.mec_organizer_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_organizer_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_organizer_thumbnail').val(attachment.attributes.url);$('.mec_organizer_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_organizer_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_organizer_thumbnail_img').html('');$('#mec_organizer_thumbnail').val('');$('.mec_organizer_remove_image_button').toggleClass('mec-util-hidden');});$('#mec_fes_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_thumbnail_img').html('');$('#mec_fes_thumbnail').val('');$('#mec_featured_image_file').val('');$('#mec_fes_remove_image_button').addClass('mec-util-hidden');});$('#mec_fes_location_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_location_thumbnail_img').html('');$('#mec_fes_location_thumbnail').val('');$('#mec_fes_location_thumbnail_file').val('');$('#mec_fes_location_remove_image_button').addClass('mec-util-hidden');});$('#mec_fes_organizer_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_organizer_thumbnail_img').html('');$('#mec_fes_organizer_thumbnail').val('');$('#mec_fes_organizer_thumbnail_file').val('');$('#mec_fes_organizer_remove_image_button').addClass('mec-util-hidden');});if($.fn.datepicker){$('#mec_start_date').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});$('#mec_end_date').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});$('#mec_date_repeat_end_at_date').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});$('.mec_date_picker').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});}
$('#mec_location_id').on('change',function()
{mec_location_toggle();});$('#mec_organizer_id').on('change',function()
{mec_organizer_toggle();});mec_location_toggle();mec_organizer_toggle();$('#mec_repeat').on('change',function()
{mec_repeat_toggle();});mec_repeat_toggle();$('#mec_repeat_type').on('change',function()
{mec_repeat_type_toggle();});mec_repeat_type_toggle();$('#mec_bookings_limit_unlimited').on('change',function()
{mec_bookings_unlimited_toggle();});$('#mec_add_in_days').on('click',function()
{var start=$('#mec_exceptions_in_days_start_date').val();if(start==='')return false;var end=$('#mec_exceptions_in_days_end_date').val();if(end==='')return false;var value=start+':'+end;var label=start+' - '+end;var key=$('#mec_new_in_days_key').val();var html=$('#mec_new_in_days_raw').html().replace(/:i:/g,key).replace(/:val:/g,value).replace(/:label:/g,label);$('#mec_in_days').append(html);$('#mec_new_in_days_key').val(parseInt(key)+1);});$('#mec_add_not_in_days').on('click',function()
{var date=$('#mec_exceptions_not_in_days_date').val();if(date==='')return false;var key=$('#mec_new_not_in_days_key').val();var html=$('#mec_new_not_in_days_raw').html().replace(/:i:/g,key).replace(/:val:/g,date);$('#mec_not_in_days').append(html);$('#mec_new_not_in_days_key').val(parseInt(key)+1);});$('#mec_add_ticket_button').on('click',function()
{var key=$('#mec_new_ticket_key').val();var html=$('#mec_new_ticket_raw').html().replace(/:i:/g,key);$('#mec_tickets').append(html);$('#mec_new_ticket_key').val(parseInt(key)+1);$('.mec_add_price_date_button').off('click').on('click',function()
{mec_handle_add_price_date_button(this);});});$('.mec_add_price_date_button').off('click').on('click',function()
{mec_handle_add_price_date_button(this);});$('#mec_add_hourly_schedule_day_button').on('click',function()
{var key=$('#mec_new_hourly_schedule_day_key').val();var html=$('#mec_new_hourly_schedule_day_raw').html().replace(/:d:/g,key).replace(/:dd:/g,parseInt(key)+1);$('#mec_meta_box_hourly_schedule_days').append(html);$('#mec_new_hourly_schedule_day_key').val(parseInt(key)+1);mec_hourly_schedule_listeners();});mec_hourly_schedule_listeners();$('#mec_add_fee_button').on('click',function()
{var key=$('#mec_new_fee_key').val();var html=$('#mec_new_fee_raw').html().replace(/:i:/g,key);$('#mec_fees_list').append(html);$('#mec_new_fee_key').val(parseInt(key)+1);});$('#mec_add_ticket_variation_button').on('click',function()
{var key=$('#mec_new_ticket_variation_key').val();var html=$('#mec_new_ticket_variation_raw').html().replace(/:i:/g,key);$('#mec_ticket_variations_list').append(html);$('#mec_new_ticket_variation_key').val(parseInt(key)+1);});$('.mec-form-row.mec-available-color-row span').on('click',function()
{$('.mec-form-row.mec-available-color-row span').removeClass('color-selected');$(this).addClass('color-selected');});$('#mec_reg_form_field_types button').on('click',function()
{var type=$(this).data('type');if(type=='mec_email'){if($('#mec_reg_form_fields').find('input[value="mec_email"][type="hidden"]').length){return false;}}
if(type=='name'){if($('#mec_reg_form_fields').find('input[value="name"][type="hidden"]').length){return false;}}
var key=$('#mec_new_reg_field_key').val();var html=$('#mec_reg_field_'+type).html().replace(/:i:/g,key);$('#mec_reg_form_fields').append(html);$('#mec_new_reg_field_key').val(parseInt(key)+1);mec_reg_fields_option_listeners();});mec_reg_fields_option_listeners();$('#mec-advanced-wraper ul > ul > li').click(function()
{if($(this).attr('class')=='')$(this).attr('class','mec-active');else $(this).attr('class','');$('#mec_date_repeat_advanced').val($('#mec-advanced-wraper div:first-child > ul').find('.mec-active').find('span').text().slice(0,-1));});});function mec_location_toggle()
{if(jQuery('#mec_location_id').val()!='0')jQuery('#mec_location_new_container').hide();else jQuery('#mec_location_new_container').show();}
function mec_organizer_toggle()
{if(jQuery('#mec_organizer_id').val()!='0')jQuery('#mec_organizer_new_container').hide();else jQuery('#mec_organizer_new_container').show();}
function mec_repeat_toggle()
{if(jQuery('#mec_repeat').is(':checked'))jQuery('.mec-form-repeating-event-row').show();else jQuery('.mec-form-repeating-event-row').hide();}
function mec_repeat_type_toggle()
{var repeat_type=jQuery('#mec_repeat_type').val();if(repeat_type=='certain_weekdays')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').show();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}
else if(repeat_type=='custom_days')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').show();jQuery('#mec_end_wrapper').hide();jQuery('#mec-advanced-wraper').hide();}
else if(repeat_type=='advanced')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').show();}
else if(repeat_type!='daily'&&repeat_type!='weekly')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}
else
{jQuery('#mec_repeat_interval_container').show();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}}
function mec_in_days_remove(i)
{jQuery('#mec_in_days_row'+i).remove();}
function mec_not_in_days_remove(i)
{jQuery('#mec_not_in_days_row'+i).remove();}
function mec_bookings_unlimited_toggle()
{jQuery('#mec_bookings_limit').toggleClass('mec-util-hidden');}
function mec_hourly_schedule_listeners()
{jQuery('.mec-add-hourly-schedule-button').off('click').on('click',function()
{var day=jQuery(this).data('day');var key=jQuery('#mec_new_hourly_schedule_key'+day).val();var html=jQuery('#mec_new_hourly_schedule_raw'+day).html().replace(/:i:/g,key).replace(/:d:/g,day);jQuery('#mec_hourly_schedules'+day).append(html);jQuery('#mec_new_hourly_schedule_key'+day).val(parseInt(key)+1);});}
function mec_hourly_schedule_remove(day,i)
{jQuery("#mec_hourly_schedule_row"+day+'_'+i).remove();}
function mec_hourly_schedule_day_remove(day)
{jQuery("#mec_meta_box_hourly_schedule_day_"+day).remove();}
function mec_ticket_remove(i)
{jQuery("#mec_ticket_row"+i).remove();}
function mec_set_event_color(color)
{try
{jQuery("#mec_event_color").wpColorPicker('color','#'+color);}
catch(e)
{jQuery("#mec_event_color").val(color);}}
function mec_remove_fee(key)
{jQuery("#mec_fee_row"+key).remove();}
function mec_remove_ticket_variation(key)
{jQuery("#mec_ticket_variation_row"+key).remove();}
function mec_reg_fields_option_listeners()
{jQuery('button.mec-reg-field-add-option').on('click',function()
{var field_id=jQuery(this).data('field-id');var key=jQuery('#mec_new_reg_field_option_key_'+field_id).val();var html=jQuery('#mec_reg_field_option').html().replace(/:i:/g,key).replace(/:fi:/g,field_id);jQuery('#mec_reg_fields_'+field_id+'_options_container').append(html);jQuery('#mec_new_reg_field_option_key_'+field_id).val(parseInt(key)+1);});if(typeof jQuery.fn.sortable!=='undefined')
{jQuery("#mec_reg_form_fields").sortable({handle:'.mec_reg_field_sort'});jQuery(".mec_reg_fields_options_container").sortable({handle:'.mec_reg_field_option_sort'});}}
function mec_reg_fields_option_remove(field_key,key)
{jQuery("#mec_reg_fields_option_"+field_key+"_"+key).remove();}
function mec_reg_fields_remove(key)
{jQuery("#mec_reg_fields_"+key).remove();}
function mec_handle_add_price_date_button(e)
{var key=jQuery(e).data('key');var p=jQuery('#mec_new_ticket_price_key_'+key).val();var html=jQuery('#mec_new_ticket_price_raw_'+key).html().replace(/:i:/g,key).replace(/:j:/g,p);jQuery('#mec-ticket-price-dates-'+key).append(html);jQuery('#mec_new_ticket_price_key_'+key).val(parseInt(p)+1);jQuery('#mec-ticket-price-dates-'+key+' .new_added').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});}
function mec_ticket_price_remove(ticket_key,price_key)
{jQuery("#mec_ticket_price_raw_"+ticket_key+"_"+price_key).remove();}
;/*! Lity - v2.1.0 - 2016-09-19
* http://sorgalla.com/lity/
* Copyright (c) 2015-2016 Jan Sorgalla; Licensed MIT */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(c){return b(a,c)}):"object"==typeof module&&"object"==typeof module.exports?module.exports=b(a,require("jquery")):a.lity=b(a,a.jQuery||a.Zepto)}("undefined"!=typeof window?window:this,function(a,b){"use strict";function c(a){var b=A();return L&&a.length?(a.one(L,b.resolve),setTimeout(b.resolve,500)):b.resolve(),b.promise()}function d(a,c,d){if(1===arguments.length)return b.extend({},a);if("string"==typeof c){if("undefined"==typeof d)return"undefined"==typeof a[c]?null:a[c];a[c]=d}else b.extend(a,c);return this}function e(a){for(var b,c=decodeURI(a.split("#")[0]).split("&"),d={},e=0,f=c.length;e<f;e++)c[e]&&(b=c[e].split("="),d[b[0]]=b[1]);return d}function f(a,c){return a+(a.indexOf("?")>-1?"&":"?")+b.param(c)}function g(a,b){var c=a.indexOf("#");return-1===c?b:(c>0&&(a=a.substr(c)),b+a)}function h(a){return b('<span class="lity-error"/>').append(a)}function i(a,c){var d=c.opener()&&c.opener().data("lity-desc")||"Image with no description",e=b('<img src="'+a+'" alt="'+d+'"/>'),f=A(),g=function(){f.reject(h("Failed loading image"))};return e.on("load",function(){return 0===this.naturalWidth?g():void f.resolve(e)}).on("error",g),f.promise()}function j(a,c){var d,e,f;try{d=b(a)}catch(a){return!1}return!!d.length&&(e=b('<i style="display:none !important"/>'),f=d.hasClass("lity-hide"),c.element().one("lity:remove",function(){e.before(d).remove(),f&&!d.closest(".lity-content").length&&d.addClass("lity-hide")}),d.removeClass("lity-hide").after(e))}function k(a){var c=I.exec(a);return!!c&&n(g(a,f("https://www.youtube"+(c[2]||"")+".com/embed/"+c[4],b.extend({autoplay:1},e(c[5]||"")))))}function l(a){var c=J.exec(a);return!!c&&n(g(a,f("https://player.vimeo.com/video/"+c[3],b.extend({autoplay:1},e(c[4]||"")))))}function m(a){var b=K.exec(a);return!!b&&n(g(a,f("https://www.google."+b[3]+"/maps?"+b[6],{output:b[6].indexOf("layer=c")>0?"svembed":"embed"})))}function n(a){return'<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="'+a+'"/></div>'}function o(){return y.documentElement.clientHeight?y.documentElement.clientHeight:Math.round(z.height())}function p(a){var b=u();b&&(27===a.keyCode&&b.close(),9===a.keyCode&&q(a,b))}function q(a,b){var c=b.element().find(F),d=c.index(y.activeElement);a.shiftKey&&d<=0?(c.get(c.length-1).focus(),a.preventDefault()):a.shiftKey||d!==c.length-1||(c.get(0).focus(),a.preventDefault())}function r(){b.each(C,function(a,b){b.resize()})}function s(a){1===C.unshift(a)&&(B.addClass("lity-active"),z.on({resize:r,keydown:p})),b("body > *").not(a.element()).addClass("lity-hidden").each(function(){var a=b(this);void 0===a.data(E)&&a.data(E,a.attr(D)||null)}).attr(D,"true")}function t(a){var c;a.element().attr(D,"true"),1===C.length&&(B.removeClass("lity-active"),z.off({resize:r,keydown:p})),C=b.grep(C,function(b){return a!==b}),c=C.length?C[0].element():b(".lity-hidden"),c.removeClass("lity-hidden").each(function(){var a=b(this),c=a.data(E);c?a.attr(D,c):a.removeAttr(D),a.removeData(E)})}function u(){return 0===C.length?null:C[0]}function v(a,c,d,e){var f,g="inline",h=b.extend({},d);return e&&h[e]?(f=h[e](a,c),g=e):(b.each(["inline","iframe"],function(a,b){delete h[b],h[b]=d[b]}),b.each(h,function(b,d){return!d||(!(!d.test||d.test(a,c))||(f=d(a,c),!1!==f?(g=b,!1):void 0))})),{handler:g,content:f||""}}function w(a,e,f,g){function h(a){k=b(a).css("max-height",o()+"px"),j.find(".lity-loader").each(function(){var a=b(this);c(a).always(function(){a.remove()})}),j.removeClass("lity-loading").find(".lity-content").empty().append(k),m=!0,k.trigger("lity:ready",[l])}var i,j,k,l=this,m=!1,n=!1;e=b.extend({},G,e),j=b(e.template),l.element=function(){return j},l.opener=function(){return f},l.options=b.proxy(d,l,e),l.handlers=b.proxy(d,l,e.handlers),l.resize=function(){m&&!n&&k.css("max-height",o()+"px").trigger("lity:resize",[l])},l.close=function(){if(m&&!n){n=!0,t(l);var a=A();return g&&b.contains(j,y.activeElement)&&g.focus(),k.trigger("lity:close",[l]),j.removeClass("lity-opened").addClass("lity-closed"),c(k.add(j)).always(function(){k.trigger("lity:remove",[l]),j.remove(),j=void 0,a.resolve()}),a.promise()}},i=v(a,l,e.handlers,e.handler),j.attr(D,"false").addClass("lity-loading lity-opened lity-"+i.handler).appendTo("body").focus().on("click","[data-lity-close]",function(a){b(a.target).is("[data-lity-close]")&&l.close()}).trigger("lity:open",[l]),s(l),b.when(i.content).always(h)}function x(a,c,d){a.preventDefault?(a.preventDefault(),d=b(this),a=d.data("lity-target")||d.attr("href")||d.attr("src")):d=b(d);var e=new w(a,b.extend({},d.data("lity-options")||d.data("lity"),c),d,y.activeElement);if(!a.preventDefault)return e}var y=a.document,z=b(a),A=b.Deferred,B=b("html"),C=[],D="aria-hidden",E="lity-"+D,F='a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])',G={handler:null,handlers:{image:i,inline:j,youtube:k,vimeo:l,googlemaps:m,iframe:n},template:'<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'},H=/(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i,I=/(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i,J=/(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/,K=/((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i,L=function(){var a=y.createElement("div"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return b[c];return!1}();return i.test=function(a){return H.test(a)},x.version="2.1.0",x.options=b.proxy(d,x,G),x.handlers=b.proxy(d,x,G.handlers),x.current=u,b(y).on("click.lity","[data-lity]",x),x});
;/*
 *  colourBrightness.js
 *
 *  Copyright 2013-2016, Jamie Brittain - http://jamiebrittain.com
 *  Released under the WTFPL license
 *  http://sam.zoy.org/wtfpl/
 *
 *  Github:  http://github.com/jamiebrittain/colourBrightness.js
 *  Version: 1.2
 */
!function(r){r.fn.colourBrightness=function(){function r(r){for(var t="";"html"!=r[0].tagName.toLowerCase()&&(t=r.css("background-color"),"rgba(0, 0, 0, 0)"==t||"transparent"==t);)r=r.parent();return t}var t,a,s,e,n=r(this);return n.match(/^rgb/)?(n=n.match(/rgba?\(([^)]+)\)/)[1],n=n.split(/ *, */).map(Number),t=n[0],a=n[1],s=n[2]):"#"==n[0]&&7==n.length?(t=parseInt(n.slice(1,3),16),a=parseInt(n.slice(3,5),16),s=parseInt(n.slice(5,7),16)):"#"==n[0]&&4==n.length&&(t=parseInt(n[1]+n[1],16),a=parseInt(n[2]+n[2],16),s=parseInt(n[3]+n[3],16)),e=(299*t+587*a+114*s)/1e3,125>e?this.removeClass("light").addClass("dark"):this.removeClass("dark").addClass("light"),this}}(jQuery);

;/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
/**
 * Owl carousel
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
    function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
        this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
        this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
        this.$element = $(element);

		/**
		 * Proxied event handlers.
		 * @protected
		 */
        this._handlers = {};

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
        this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from being retriggered.
		 * @protected
		 */
        this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
        this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
        this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
        this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
        this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
        this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
        this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
        this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
        this._mergers = [];

		/**
		 * Widths of all items.
		 */
        this._widths = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
        this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
        this._pipe = [];

		/**
		 * Current state information for the drag operation.
		 * @todo #261
		 * @protected
		 */
        this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        };

		/**
		 * Current state information and their tags.
		 * @type {Object}
		 * @protected
		 */
        this._states = {
            current: {},
            tags: {
                'initializing': ['busy'],
                'animating': ['busy'],
                'dragging': ['interacting']
            }
        };

        $.each(['onResize', 'onThrottledResize'], $.proxy(function (i, handler) {
            this._handlers[handler] = $.proxy(this[handler], this);
        }, this));

        $.each(Owl.Plugins, $.proxy(function (key, plugin) {
            this._plugins[key.charAt(0).toLowerCase() + key.slice(1)]
                = new plugin(this);
        }, this));

        $.each(Owl.Workers, $.proxy(function (priority, worker) {
            this._pipe.push({
                'filter': worker.filter,
                'run': $.proxy(worker.run, this)
            });
        }, this));

        this.setup();
        this.initialize();
    }

	/**
	 * Default options for the carousel.
	 * @public
	 */
    Owl.Defaults = {
        items: 3,
        loop: false,
        center: false,
        rewind: false,
        checkVisibility: true,

        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,

        margin: 0,
        stagePadding: 0,

        merge: false,
        mergeFit: true,
        autoWidth: false,

        startPosition: 0,
        rtl: false,

        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,

        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: window,

        fallbackEasing: 'swing',
        slideTransition: '',

        info: false,

        nestedItemSelector: false,
        itemElement: 'div',
        stageElement: 'div',

        refreshClass: 'owl-refresh',
        loadedClass: 'owl-loaded',
        loadingClass: 'owl-loading',
        rtlClass: 'owl-rtl',
        responsiveClass: 'owl-responsive',
        dragClass: 'owl-drag',
        itemClass: 'owl-item',
        stageClass: 'owl-stage',
        stageOuterClass: 'owl-stage-outer',
        grabClass: 'owl-grab'
    };

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
    Owl.Width = {
        Default: 'default',
        Inner: 'inner',
        Outer: 'outer'
    };

	/**
	 * Enumeration for types.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
    Owl.Type = {
        Event: 'event',
        State: 'state'
    };

	/**
	 * Contains all registered plugins.
	 * @public
	 */
    Owl.Plugins = {};

	/**
	 * List of workers involved in the update process.
	 */
    Owl.Workers = [{
        filter: ['width', 'settings'],
        run: function () {
            this._width = this.$element.width();
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            this.$stage.children('.cloned').remove();
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var margin = this.settings.margin || '',
                grid = !this.settings.autoWidth,
                rtl = this.settings.rtl,
                css = {
                    'width': 'auto',
                    'margin-left': rtl ? margin : '',
                    'margin-right': rtl ? '' : margin
                };

            !grid && this.$stage.children().css(css);

            cache.css = css;
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                merge = null,
                iterator = this._items.length,
                grid = !this.settings.autoWidth,
                widths = [];

            cache.items = {
                merge: false,
                width: width
            };

            while (iterator--) {
                merge = this._mergers[iterator];
                merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;

                cache.items.merge = merge > 1 || cache.items.merge;

                widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
            }

            this._widths = widths;
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            var clones = [],
                items = this._items,
                settings = this.settings,
                // TODO: Should be computed from number of min width items in stage
                view = Math.max(settings.items * 2, 4),
                size = Math.ceil(items.length / 2) * 2,
                repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
                append = '',
                prepend = '';

            repeat /= 2;

            while (repeat > 0) {
                // Switch to only using appended clones
                clones.push(this.normalize(clones.length / 2, true));
                append = append + items[clones[clones.length - 1]][0].outerHTML;
                clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
                prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
                repeat -= 1;
            }

            this._clones = clones;

            $(append).addClass('cloned').appendTo(this.$stage);
            $(prepend).addClass('cloned').prependTo(this.$stage);
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var rtl = this.settings.rtl ? 1 : -1,
                size = this._clones.length + this._items.length,
                iterator = -1,
                previous = 0,
                current = 0,
                coordinates = [];

            while (++iterator < size) {
                previous = coordinates[iterator - 1] || 0;
                current = this._widths[this.relative(iterator)] + this.settings.margin;
                coordinates.push(previous + current * rtl);
            }

            this._coordinates = coordinates;
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var padding = this.settings.stagePadding,
                coordinates = this._coordinates,
                css = {
                    'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
                    'padding-left': padding || '',
                    'padding-right': padding || ''
                };

            this.$stage.css(css);
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var iterator = this._coordinates.length,
                grid = !this.settings.autoWidth,
                items = this.$stage.children();

            if (grid && cache.items.merge) {
                while (iterator--) {
                    cache.css.width = this._widths[this.relative(iterator)];
                    items.eq(iterator).css(cache.css);
                }
            } else if (grid) {
                cache.css.width = cache.items.width;
                items.css(cache.css);
            }
        }
    }, {
        filter: ['items'],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr('style');
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
            cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
            this.reset(cache.current);
        }
    }, {
        filter: ['position'],
        run: function () {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter: ['width', 'position', 'items', 'settings'],
        run: function () {
            var rtl = this.settings.rtl ? 1 : -1,
                padding = this.settings.stagePadding * 2,
                begin = this.coordinates(this.current()) + padding,
                end = begin + this.width() * rtl,
                inner, outer, matches = [], i, n;

            for (i = 0, n = this._coordinates.length; i < n; i++) {
                inner = this._coordinates[i - 1] || 0;
                outer = Math.abs(this._coordinates[i]) + padding * rtl;

                if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
                    || (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
                    matches.push(i);
                }
            }

            this.$stage.children('.active').removeClass('active');
            this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');

            this.$stage.children('.center').removeClass('center');
            if (this.settings.center) {
                this.$stage.children().eq(this.current()).addClass('center');
            }
        }
    }];

	/**
	 * Create the stage DOM element
	 */
    Owl.prototype.initializeStage = function () {
        this.$stage = this.$element.find('.' + this.settings.stageClass);

        // if the stage is already in the DOM, grab it and skip stage initialization
        if (this.$stage.length) {
            return;
        }

        this.$element.addClass(this.options.loadingClass);

        // create stage
        this.$stage = $('<' + this.settings.stageElement + '>', {
            "class": this.settings.stageClass
        }).wrap($('<div/>', {
            "class": this.settings.stageOuterClass
        }));

        // append stage
        this.$element.append(this.$stage.parent());
    };

	/**
	 * Create item DOM elements
	 */
    Owl.prototype.initializeItems = function () {
        var $items = this.$element.find('.owl-item');

        // if the items are already in the DOM, grab them and skip item initialization
        if ($items.length) {
            this._items = $items.get().map(function (item) {
                return $(item);
            });

            this._mergers = this._items.map(function () {
                return 1;
            });

            this.refresh();

            return;
        }

        // append content
        this.replace(this.$element.children().not(this.$stage.parent()));

        // check visibility
        if (this.isVisible()) {
            // update view
            this.refresh();
        } else {
            // invalidate width
            this.invalidate('width');
        }

        this.$element
            .removeClass(this.options.loadingClass)
            .addClass(this.options.loadedClass);
    };

	/**
	 * Initializes the carousel.
	 * @protected
	 */
    Owl.prototype.initialize = function () {
        this.enter('initializing');
        this.trigger('initialize');

        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

        if (this.settings.autoWidth && !this.is('pre-loading')) {
            var imgs, nestedSelector, width;
            imgs = this.$element.find('img');
            nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
            width = this.$element.children(nestedSelector).width();

            if (imgs.length && width <= 0) {
                this.preloadAutoWidthImages(imgs);
            }
        }

        this.initializeStage();
        this.initializeItems();

        // register event handlers
        this.registerEventHandlers();

        this.leave('initializing');
        this.trigger('initialized');
    };

	/**
	 * @returns {Boolean} visibility of $element
	 *                    if you know the carousel will always be visible you can set `checkVisibility` to `false` to
	 *                    prevent the expensive browser layout forced reflow the $element.is(':visible') does
	 */
    Owl.prototype.isVisible = function () {
        return this.settings.checkVisibility
            ? this.$element.is(':visible')
            : true;
    };

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
    Owl.prototype.setup = function () {
        var viewport = this.viewport(),
            overwrites = this.options.responsive,
            match = -1,
            settings = null;

        if (!overwrites) {
            settings = $.extend({}, this.options);
        } else {
            $.each(overwrites, function (breakpoint) {
                if (breakpoint <= viewport && breakpoint > match) {
                    match = Number(breakpoint);
                }
            });

            settings = $.extend({}, this.options, overwrites[match]);
            if (typeof settings.stagePadding === 'function') {
                settings.stagePadding = settings.stagePadding();
            }
            delete settings.responsive;

            // responsive class
            if (settings.responsiveClass) {
                this.$element.attr('class',
                    this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)
                );
            }
        }

        this.trigger('change', { property: { name: 'settings', value: settings } });
        this._breakpoint = match;
        this.settings = settings;
        this.invalidate('settings');
        this.trigger('changed', { property: { name: 'settings', value: this.settings } });
    };

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
    Owl.prototype.optionsLogic = function () {
        if (this.settings.autoWidth) {
            this.settings.stagePadding = false;
            this.settings.merge = false;
        }
    };

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
    Owl.prototype.prepare = function (item) {
        var event = this.trigger('prepare', { content: item });

        if (!event.data) {
            event.data = $('<' + this.settings.itemElement + '/>')
                .addClass(this.options.itemClass).append(item)
        }

        this.trigger('prepared', { content: event.data });

        return event.data;
    };

	/**
	 * Updates the view.
	 * @public
	 */
    Owl.prototype.update = function () {
        var i = 0,
            n = this._pipe.length,
            filter = $.proxy(function (p) { return this[p] }, this._invalidated),
            cache = {};

        while (i < n) {
            if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
                this._pipe[i].run(cache);
            }
            i++;
        }

        this._invalidated = {};

        !this.is('valid') && this.enter('valid');
    };

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
    Owl.prototype.width = function (dimension) {
        dimension = dimension || Owl.Width.Default;
        switch (dimension) {
            case Owl.Width.Inner:
            case Owl.Width.Outer:
                return this._width;
            default:
                return this._width - this.settings.stagePadding * 2 + this.settings.margin;
        }
    };

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
    Owl.prototype.refresh = function () {
        this.enter('refreshing');
        this.trigger('refresh');

        this.setup();

        this.optionsLogic();

        this.$element.addClass(this.options.refreshClass);

        this.update();

        this.$element.removeClass(this.options.refreshClass);

        this.leave('refreshing');
        this.trigger('refreshed');
    };

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
    Owl.prototype.onThrottledResize = function () {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
    };

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
    Owl.prototype.onResize = function () {
        if (!this._items.length) {
            return false;
        }

        if (this._width === this.$element.width()) {
            return false;
        }

        if (!this.isVisible()) {
            return false;
        }

        this.enter('resizing');

        if (this.trigger('resize').isDefaultPrevented()) {
            this.leave('resizing');
            return false;
        }

        this.invalidate('width');

        this.refresh();

        this.leave('resizing');
        this.trigger('resized');
    };

	/**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
    Owl.prototype.registerEventHandlers = function () {
        if ($.support.transition) {
            this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
        }

        if (this.settings.responsive !== false) {
            this.on(window, 'resize', this._handlers.onThrottledResize);
        }

        if (this.settings.mouseDrag) {
            this.$element.addClass(this.options.dragClass);
            this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
            this.$stage.on('dragstart.owl.core selectstart.owl.core', function () { return false });
        }

        if (this.settings.touchDrag) {
            this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
            this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
        }
    };

	/**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragStart = function (event) {
        var stage = null;

        if (event.which === 3) {
            return;
        }

        if ($.support.transform) {
            stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
            stage = {
                x: stage[stage.length === 16 ? 12 : 4],
                y: stage[stage.length === 16 ? 13 : 5]
            };
        } else {
            stage = this.$stage.position();
            stage = {
                x: this.settings.rtl ?
                    stage.left + this.$stage.width() - this.width() + this.settings.margin :
                    stage.left,
                y: stage.top
            };
        }

        if (this.is('animating')) {
            $.support.transform ? this.animate(stage.x) : this.$stage.stop()
            this.invalidate('position');
        }

        this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');

        this.speed(0);

        this._drag.time = new Date().getTime();
        this._drag.target = $(event.target);
        this._drag.stage.start = stage;
        this._drag.stage.current = stage;
        this._drag.pointer = this.pointer(event);

        $(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));

        $(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function (event) {
            var delta = this.difference(this._drag.pointer, this.pointer(event));

            $(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));

            if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
                return;
            }

            event.preventDefault();

            this.enter('dragging');
            this.trigger('drag');
        }, this));
    };

	/**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragMove = function (event) {
        var minimum = null,
            maximum = null,
            pull = null,
            delta = this.difference(this._drag.pointer, this.pointer(event)),
            stage = this.difference(this._drag.stage.start, delta);

        if (!this.is('dragging')) {
            return;
        }

        event.preventDefault();

        if (this.settings.loop) {
            minimum = this.coordinates(this.minimum());
            maximum = this.coordinates(this.maximum() + 1) - minimum;
            stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
        } else {
            minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
            maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
            pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
            stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
        }

        this._drag.stage.current = stage;

        this.animate(stage.x);
    };

	/**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragEnd = function (event) {
        var delta = this.difference(this._drag.pointer, this.pointer(event)),
            stage = this._drag.stage.current,
            direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';

        $(document).off('.owl.core');

        this.$element.removeClass(this.options.grabClass);

        if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
            this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
            this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
            this.invalidate('position');
            this.update();

            this._drag.direction = direction;

            if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
                this._drag.target.one('click.owl.core', function () { return false; });
            }
        }

        if (!this.is('dragging')) {
            return;
        }

        this.leave('dragging');
        this.trigger('dragged');
    };

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
    Owl.prototype.closest = function (coordinate, direction) {
        var position = -1,
            pull = 30,
            width = this.width(),
            coordinates = this.coordinates();

        if (!this.settings.freeDrag) {
            // check closest item
            $.each(coordinates, $.proxy(function (index, value) {
                // on a left pull, check on current index
                if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
                    position = index;
                    // on a right pull, check on previous index
                    // to do so, subtract width from value and set position = index + 1
                } else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
                    position = index + 1;
                } else if (this.op(coordinate, '<', value)
                    && this.op(coordinate, '>', coordinates[index + 1] !== undefined ? coordinates[index + 1] : value - width)) {
                    position = direction === 'left' ? index + 1 : index;
                }
                return position === -1;
            }, this));
        }

        if (!this.settings.loop) {
            // non loop boundries
            if (this.op(coordinate, '>', coordinates[this.minimum()])) {
                position = coordinate = this.minimum();
            } else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
                position = coordinate = this.maximum();
            }
        }

        return position;
    };

	/**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
    Owl.prototype.animate = function (coordinate) {
        var animate = this.speed() > 0;

        this.is('animating') && this.onTransitionEnd();

        if (animate) {
            this.enter('animating');
            this.trigger('translate');
        }

        if ($.support.transform3d && $.support.transition) {
            this.$stage.css({
                transform: 'translate3d(' + coordinate + 'px,0px,0px)',
                transition: (this.speed() / 1000) + 's' + (
                    this.settings.slideTransition ? ' ' + this.settings.slideTransition : ''
                )
            });
        } else if (animate) {
            this.$stage.animate({
                left: coordinate + 'px'
            }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
        } else {
            this.$stage.css({
                left: coordinate + 'px'
            });
        }
    };

	/**
	 * Checks whether the carousel is in a specific state or not.
	 * @param {String} state - The state to check.
	 * @returns {Boolean} - The flag which indicates if the carousel is busy.
	 */
    Owl.prototype.is = function (state) {
        return this._states.current[state] && this._states.current[state] > 0;
    };

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
    Owl.prototype.current = function (position) {
        if (position === undefined) {
            return this._current;
        }

        if (this._items.length === 0) {
            return undefined;
        }

        position = this.normalize(position);

        if (this._current !== position) {
            var event = this.trigger('change', { property: { name: 'position', value: position } });

            if (event.data !== undefined) {
                position = this.normalize(event.data);
            }

            this._current = position;

            this.invalidate('position');

            this.trigger('changed', { property: { name: 'position', value: this._current } });
        }

        return this._current;
    };

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} [part] - The part to invalidate.
	 * @returns {Array.<String>} - The invalidated parts.
	 */
    Owl.prototype.invalidate = function (part) {
        if ($.type(part) === 'string') {
            this._invalidated[part] = true;
            this.is('valid') && this.leave('valid');
        }
        return $.map(this._invalidated, function (v, i) { return i });
    };

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
    Owl.prototype.reset = function (position) {
        position = this.normalize(position);

        if (position === undefined) {
            return;
        }

        this._speed = 0;
        this._current = position;

        this.suppress(['translate', 'translated']);

        this.animate(this.coordinates(position));

        this.release(['translate', 'translated']);
    };

	/**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
    Owl.prototype.normalize = function (position, relative) {
        var n = this._items.length,
            m = relative ? 0 : this._clones.length;

        if (!this.isNumeric(position) || n < 1) {
            position = undefined;
        } else if (position < 0 || position >= n + m) {
            position = ((position - m / 2) % n + n) % n + m / 2;
        }

        return position;
    };

	/**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
    Owl.prototype.relative = function (position) {
        position -= this._clones.length / 2;
        return this.normalize(position, true);
    };

	/**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
    Owl.prototype.maximum = function (relative) {
        var settings = this.settings,
            maximum = this._coordinates.length,
            iterator,
            reciprocalItemsWidth,
            elementWidth;

        if (settings.loop) {
            maximum = this._clones.length / 2 + this._items.length - 1;
        } else if (settings.autoWidth || settings.merge) {
            iterator = this._items.length;
            if (iterator) {
                reciprocalItemsWidth = this._items[--iterator].width();
                elementWidth = this.$element.width();
                while (iterator--) {
                    reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
                    if (reciprocalItemsWidth > elementWidth) {
                        break;
                    }
                }
            }
            maximum = iterator + 1;
        } else if (settings.center) {
            maximum = this._items.length - 1;
        } else {
            maximum = this._items.length - settings.items;
        }

        if (relative) {
            maximum -= this._clones.length / 2;
        }

        return Math.max(maximum, 0);
    };

	/**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
    Owl.prototype.minimum = function (relative) {
        return relative ? 0 : this._clones.length / 2;
    };

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
    Owl.prototype.items = function (position) {
        if (position === undefined) {
            return this._items.slice();
        }

        position = this.normalize(position, true);
        return this._items[position];
    };

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
    Owl.prototype.mergers = function (position) {
        if (position === undefined) {
            return this._mergers.slice();
        }

        position = this.normalize(position, true);
        return this._mergers[position];
    };

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
    Owl.prototype.clones = function (position) {
        var odd = this._clones.length / 2,
            even = odd + this._items.length,
            map = function (index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

        if (position === undefined) {
            return $.map(this._clones, function (v, i) { return map(i) });
        }

        return $.map(this._clones, function (v, i) { return v === position ? map(i) : null });
    };

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
    Owl.prototype.speed = function (speed) {
        if (speed !== undefined) {
            this._speed = speed;
        }

        return this._speed;
    };

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
    Owl.prototype.coordinates = function (position) {
        var multiplier = 1,
            newPosition = position - 1,
            coordinate;

        if (position === undefined) {
            return $.map(this._coordinates, $.proxy(function (coordinate, index) {
                return this.coordinates(index);
            }, this));
        }

        if (this.settings.center) {
            if (this.settings.rtl) {
                multiplier = -1;
                newPosition = position + 1;
            }

            coordinate = this._coordinates[position];
            coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
        } else {
            coordinate = this._coordinates[newPosition] || 0;
        }

        coordinate = Math.ceil(coordinate);

        return coordinate;
    };

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
    Owl.prototype.duration = function (from, to, factor) {
        if (factor === 0) {
            return 0;
        }

        return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
    };

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.to = function (position, speed) {
        var current = this.current(),
            revert = null,
            distance = position - this.relative(current),
            direction = (distance > 0) - (distance < 0),
            items = this._items.length,
            minimum = this.minimum(),
            maximum = this.maximum();

        if (this.settings.loop) {
            if (!this.settings.rewind && Math.abs(distance) > items / 2) {
                distance += direction * -1 * items;
            }

            position = current + distance;
            revert = ((position - minimum) % items + items) % items + minimum;

            if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
                current = revert - distance;
                position = revert;
                this.reset(current);
            }
        } else if (this.settings.rewind) {
            maximum += 1;
            position = (position % maximum + maximum) % maximum;
        } else {
            position = Math.max(minimum, Math.min(maximum, position));
        }

        this.speed(this.duration(current, position, speed));
        this.current(position);

        if (this.isVisible()) {
            this.update();
        }
    };

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.next = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) + 1, speed);
    };

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.prev = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) - 1, speed);
    };

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onTransitionEnd = function (event) {

        // if css2 animation then event object is undefined
        if (event !== undefined) {
            event.stopPropagation();

            // Catch only owl-stage transitionEnd event
            if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
                return false;
            }
        }

        this.leave('animating');
        this.trigger('translated');
    };

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
    Owl.prototype.viewport = function () {
        var width;
        if (this.options.responsiveBaseElement !== window) {
            width = $(this.options.responsiveBaseElement).width();
        } else if (window.innerWidth) {
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        } else {
            console.warn('Can not detect viewport width.');
        }
        return width;
    };

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
    Owl.prototype.replace = function (content) {
        this.$stage.empty();
        this._items = [];

        if (content) {
            content = (content instanceof jQuery) ? content : $(content);
        }

        if (this.settings.nestedItemSelector) {
            content = content.find('.' + this.settings.nestedItemSelector);
        }

        content.filter(function () {
            return this.nodeType === 1;
        }).each($.proxy(function (index, item) {
            item = this.prepare(item);
            this.$stage.append(item);
            this._items.push(item);
            this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        }, this));

        this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

        this.invalidate('items');
    };

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
    Owl.prototype.add = function (content, position) {
        var current = this.relative(this._current);

        position = position === undefined ? this._items.length : this.normalize(position, true);
        content = content instanceof jQuery ? content : $(content);

        this.trigger('add', { content: content, position: position });

        content = this.prepare(content);

        if (this._items.length === 0 || position === this._items.length) {
            this._items.length === 0 && this.$stage.append(content);
            this._items.length !== 0 && this._items[position - 1].after(content);
            this._items.push(content);
            this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        } else {
            this._items[position].before(content);
            this._items.splice(position, 0, content);
            this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        }

        this._items[current] && this.reset(this._items[current].index());

        this.invalidate('items');

        this.trigger('added', { content: content, position: position });
    };

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
    Owl.prototype.remove = function (position) {
        position = this.normalize(position, true);

        if (position === undefined) {
            return;
        }

        this.trigger('remove', { content: this._items[position], position: position });

        this._items[position].remove();
        this._items.splice(position, 1);
        this._mergers.splice(position, 1);

        this.invalidate('items');

        this.trigger('removed', { content: null, position: position });
    };

	/**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
    Owl.prototype.preloadAutoWidthImages = function (images) {
        images.each($.proxy(function (i, element) {
            this.enter('pre-loading');
            element = $(element);
            $(new Image()).one('load', $.proxy(function (e) {
                element.attr('src', e.target.src);
                element.css('opacity', 1);
                this.leave('pre-loading');
                !this.is('pre-loading') && !this.is('initializing') && this.refresh();
            }, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
        }, this));
    };

	/**
	 * Destroys the carousel.
	 * @public
	 */
    Owl.prototype.destroy = function () {

        this.$element.off('.owl.core');
        this.$stage.off('.owl.core');
        $(document).off('.owl.core');

        if (this.settings.responsive !== false) {
            window.clearTimeout(this.resizeTimer);
            this.off(window, 'resize', this._handlers.onThrottledResize);
        }

        for (var i in this._plugins) {
            this._plugins[i].destroy();
        }

        this.$stage.children('.cloned').remove();

        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.remove();
        this.$element
            .removeClass(this.options.refreshClass)
            .removeClass(this.options.loadingClass)
            .removeClass(this.options.loadedClass)
            .removeClass(this.options.rtlClass)
            .removeClass(this.options.dragClass)
            .removeClass(this.options.grabClass)
            .attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), ''))
            .removeData('owl.carousel');
    };

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
    Owl.prototype.op = function (a, o, b) {
        var rtl = this.settings.rtl;
        switch (o) {
            case '<':
                return rtl ? a > b : a < b;
            case '>':
                return rtl ? a < b : a > b;
            case '>=':
                return rtl ? a <= b : a >= b;
            case '<=':
                return rtl ? a >= b : a <= b;
            default:
                break;
        }
    };

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
    Owl.prototype.on = function (element, event, listener, capture) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, capture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
        }
    };

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
    Owl.prototype.off = function (element, event, listener, capture) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, capture);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
        }
    };

	/**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
    Owl.prototype.trigger = function (name, data, namespace, state, enter) {
        var status = {
            item: { count: this._items.length, index: this.current() }
        }, handler = $.camelCase(
            $.grep(['on', name, namespace], function (v) { return v })
                .join('-').toLowerCase()
        ), event = $.Event(
            [name, 'owl', namespace || 'carousel'].join('.').toLowerCase(),
            $.extend({ relatedTarget: this }, status, data)
        );

        if (!this._supress[name]) {
            $.each(this._plugins, function (name, plugin) {
                if (plugin.onTrigger) {
                    plugin.onTrigger(event);
                }
            });

            this.register({ type: Owl.Type.Event, name: name });
            this.$element.trigger(event);

            if (this.settings && typeof this.settings[handler] === 'function') {
                this.settings[handler].call(this, event);
            }
        }

        return event;
    };

	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
    Owl.prototype.enter = function (name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
            if (this._states.current[name] === undefined) {
                this._states.current[name] = 0;
            }

            this._states.current[name]++;
        }, this));
    };

	/**
	 * Leaves a state.
	 * @param name - The state name.
	 */
    Owl.prototype.leave = function (name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
            this._states.current[name]--;
        }, this));
    };

	/**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
    Owl.prototype.register = function (object) {
        if (object.type === Owl.Type.Event) {
            if (!$.event.special[object.name]) {
                $.event.special[object.name] = {};
            }

            if (!$.event.special[object.name].owl) {
                var _default = $.event.special[object.name]._default;
                $.event.special[object.name]._default = function (e) {
                    if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
                        return _default.apply(this, arguments);
                    }
                    return e.namespace && e.namespace.indexOf('owl') > -1;
                };
                $.event.special[object.name].owl = true;
            }
        } else if (object.type === Owl.Type.State) {
            if (!this._states.tags[object.name]) {
                this._states.tags[object.name] = object.tags;
            } else {
                this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
            }

            this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function (tag, i) {
                return $.inArray(tag, this._states.tags[object.name]) === i;
            }, this));
        }
    };

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
    Owl.prototype.suppress = function (events) {
        $.each(events, $.proxy(function (index, event) {
            this._supress[event] = true;
        }, this));
    };

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
    Owl.prototype.release = function (events) {
        $.each(events, $.proxy(function (index, event) {
            delete this._supress[event];
        }, this));
    };

	/**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
    Owl.prototype.pointer = function (event) {
        var result = { x: null, y: null };

        event = event.originalEvent || event || window.event;

        event = event.touches && event.touches.length ?
            event.touches[0] : event.changedTouches && event.changedTouches.length ?
                event.changedTouches[0] : event;

        if (event.pageX) {
            result.x = event.pageX;
            result.y = event.pageY;
        } else {
            result.x = event.clientX;
            result.y = event.clientY;
        }

        return result;
    };

	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
    Owl.prototype.isNumeric = function (number) {
        return !isNaN(parseFloat(number));
    };

	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
    Owl.prototype.difference = function (first, second) {
        return {
            x: first.x - second.x,
            y: first.y - second.y
        };
    };

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @todo Navigation plugin `next` and `prev`
	 * @public
	 */
    $.fn.owlCarousel = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                data = $this.data('owl.carousel');

            if (!data) {
                data = new Owl(this, typeof option == 'object' && option);
                $this.data('owl.carousel', data);

                $.each([
                    'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
                ], function (i, event) {
                    data.register({ type: Owl.Type.Event, name: event });
                    data.$element.on(event + '.owl.carousel.core', $.proxy(function (e) {
                        if (e.namespace && e.relatedTarget !== this) {
                            this.suppress([event]);
                            data[event].apply(this, [].slice.call(arguments, 1));
                            this.release([event]);
                        }
                    }, data));
                });
            }

            if (typeof option == 'string' && option.charAt(0) !== '_') {
                data[option].apply(data, args);
            }
        });
    };

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
    $.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoRefresh Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the auto refresh plugin.
	 * @class The Auto Refresh Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var AutoRefresh = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * Refresh interval.
		 * @protected
		 * @type {number}
		 */
        this._interval = null;

		/**
		 * Whether the element is currently visible or not.
		 * @protected
		 * @type {Boolean}
		 */
        this._visible = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoRefresh) {
                    this.watch();
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);

        // register event handlers
        this._core.$element.on(this._handlers);
    };

	/**
	 * Default options.
	 * @public
	 */
    AutoRefresh.Defaults = {
        autoRefresh: true,
        autoRefreshInterval: 500
    };

	/**
	 * Watches the element.
	 */
    AutoRefresh.prototype.watch = function () {
        if (this._interval) {
            return;
        }

        this._visible = this._core.isVisible();
        this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
    };

	/**
	 * Refreshes the element.
	 */
    AutoRefresh.prototype.refresh = function () {
        if (this._core.isVisible() === this._visible) {
            return;
        }

        this._visible = !this._visible;

        this._core.$element.toggleClass('owl-hidden', !this._visible);

        this._visible && (this._core.invalidate('width') && this._core.refresh());
    };

	/**
	 * Destroys the plugin.
	 */
    AutoRefresh.prototype.destroy = function () {
        var handler, property;

        window.clearInterval(this._interval);

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Lazy = function (carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
        this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function (e) {
                if (!e.namespace) {
                    return;
                }

                if (!this._core.settings || !this._core.settings.lazyLoad) {
                    return;
                }

                if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
                    var settings = this._core.settings,
                        n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
                        i = ((settings.center && n * -1) || 0),
                        position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
                        clones = this._core.clones().length,
                        load = $.proxy(function (i, v) { this.load(v) }, this);
                    //TODO: Need documentation for this new option
                    if (settings.lazyLoadEager > 0) {
                        n += settings.lazyLoadEager;
                        // If the carousel is looping also preload images that are to the "left"
                        if (settings.loop) {
                            position -= settings.lazyLoadEager;
                            n++;
                        }
                    }

                    while (i++ < n) {
                        this.load(clones / 2 + this._core.relative(position));
                        clones && $.each(this._core.clones(this._core.relative(position)), load);
                        position++;
                    }
                }
            }, this)
        };

        // set the default options
        this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

        // register event handler
        this._core.$element.on(this._handlers);
    };

	/**
	 * Default options.
	 * @public
	 */
    Lazy.Defaults = {
        lazyLoad: false,
        lazyLoadEager: 0
    };

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
    Lazy.prototype.load = function (position) {
        var $item = this._core.$stage.children().eq(position),
            $elements = $item && $item.find('.owl-lazy');

        if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
            return;
        }

        $elements.each($.proxy(function (index, element) {
            var $element = $(element), image,
                url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src') || $element.attr('data-srcset');

            this._core.trigger('load', { element: $element, url: url }, 'lazy');

            if ($element.is('img')) {
                $element.one('load.owl.lazy', $.proxy(function () {
                    $element.css('opacity', 1);
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this)).attr('src', url);
            } else if ($element.is('source')) {
                $element.one('load.owl.lazy', $.proxy(function () {
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this)).attr('srcset', url);
            } else {
                image = new Image();
                image.onload = $.proxy(function () {
                    $element.css({
                        'background-image': 'url("' + url + '")',
                        'opacity': '1'
                    });
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this);
                image.src = url;
            }
        }, this));

        this._loaded.push($item.get(0));
    };

	/**
	 * Destroys the plugin.
	 * @public
	 */
    Lazy.prototype.destroy = function () {
        var handler, property;

        for (handler in this.handlers) {
            this._core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var AutoHeight = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

        this._previousHeight = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight) {
                    this.update();
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight && e.property.name === 'position') {
                    this.update();
                }
            }, this),
            'loaded.owl.lazy': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight
                    && e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
                    this.update();
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

        // register event handlers
        this._core.$element.on(this._handlers);
        this._intervalId = null;
        var refThis = this;

        // These changes have been taken from a PR by gavrochelegnou proposed in #1575
        // and have been made compatible with the latest jQuery version
        $(window).on('load', function () {
            if (refThis._core.settings.autoHeight) {
                refThis.update();
            }
        });

        // Autoresize the height of the carousel when window is resized
        // When carousel has images, the height is dependent on the width
        // and should also change on resize
        $(window).resize(function () {
            if (refThis._core.settings.autoHeight) {
                if (refThis._intervalId != null) {
                    clearTimeout(refThis._intervalId);
                }

                refThis._intervalId = setTimeout(function () {
                    refThis.update();
                }, 250);
            }
        });

    };

	/**
	 * Default options.
	 * @public
	 */
    AutoHeight.Defaults = {
        autoHeight: false,
        autoHeightClass: 'owl-height'
    };

	/**
	 * Updates the view.
	 */
    AutoHeight.prototype.update = function () {
        var start = this._core._current,
            end = start + this._core.settings.items,
            lazyLoadEnabled = this._core.settings.lazyLoad,
            visible = this._core.$stage.children().toArray().slice(start, end),
            heights = [],
            maxheight = 0;

        $.each(visible, function (index, item) {
            heights.push($(item).height());
        });

        maxheight = Math.max.apply(null, heights);

        if (maxheight <= 1 && lazyLoadEnabled && this._previousHeight) {
            maxheight = this._previousHeight;
        }

        this._previousHeight = maxheight;

        this._core.$stage.parent()
            .height(maxheight)
            .addClass(this._core.settings.autoHeightClass);
    };

    AutoHeight.prototype.destroy = function () {
        var handler, property;

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] !== 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Video = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
        this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
        this._playing = null;

		/**
		 * All event handlers.
		 * @todo The cloned content removale is too late
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    this._core.register({ type: 'state', name: 'playing', tags: ['interacting'] });
                }
            }, this),
            'resize.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
                    e.preventDefault();
                }
            }, this),
            'refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.is('resizing')) {
                    this._core.$stage.find('.cloned .owl-video-frame').remove();
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'position' && this._playing) {
                    this.stop();
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                if (!e.namespace) {
                    return;
                }

                var $element = $(e.content).find('.owl-video');

                if ($element.length) {
                    $element.css('display', 'none');
                    this.fetch($element, $(e.content));
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Video.Defaults, this._core.options);

        // register event handlers
        this._core.$element.on(this._handlers);

        this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) {
            this.play(e);
        }, this));
    };

	/**
	 * Default options.
	 * @public
	 */
    Video.Defaults = {
        video: false,
        videoHeight: false,
        videoWidth: false
    };

	/**
	 * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
    Video.prototype.fetch = function (target, item) {
        var type = (function () {
            if (target.attr('data-vimeo-id')) {
                return 'vimeo';
            } else if (target.attr('data-vzaar-id')) {
                return 'vzaar'
            } else {
                return 'youtube';
            }
        })(),
            id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
            width = target.attr('data-width') || this._core.settings.videoWidth,
            height = target.attr('data-height') || this._core.settings.videoHeight,
            url = target.attr('href');

        if (url) {

			/*
					Parses the id's out of the following urls (and probably more):
					https://www.youtube.com/watch?v=:id
					https://youtu.be/:id
					https://vimeo.com/:id
					https://vimeo.com/channels/:channel/:id
					https://vimeo.com/groups/:group/videos/:id
					https://app.vzaar.com/videos/:id

					Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
			*/

            id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

            if (id[3].indexOf('youtu') > -1) {
                type = 'youtube';
            } else if (id[3].indexOf('vimeo') > -1) {
                type = 'vimeo';
            } else if (id[3].indexOf('vzaar') > -1) {
                type = 'vzaar';
            } else {
                throw new Error('Video URL not supported.');
            }
            id = id[6];
        } else {
            throw new Error('Missing video URL.');
        }

        this._videos[url] = {
            type: type,
            id: id,
            width: width,
            height: height
        };

        item.attr('data-video', url);

        this.thumbnail(target, this._videos[url]);
    };

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
    Video.prototype.thumbnail = function (target, video) {
        var tnLink,
            icon,
            path,
            dimensions = video.width && video.height ? 'width:' + video.width + 'px;height:' + video.height + 'px;' : '',
            customTn = target.find('img'),
            srcType = 'src',
            lazyClass = '',
            settings = this._core.settings,
            create = function (path) {
                icon = '<div class="owl-video-play-icon"></div>';

                if (settings.lazyLoad) {
                    tnLink = $('<div/>', {
                        "class": 'owl-video-tn ' + lazyClass,
                        "srcType": path
                    });
                } else {
                    tnLink = $('<div/>', {
                        "class": "owl-video-tn",
                        "style": 'opacity:1;background-image:url(' + path + ')'
                    });
                }
                target.after(tnLink);
                target.after(icon);
            };

        // wrap video content into owl-video-wrapper div
        target.wrap($('<div/>', {
            "class": "owl-video-wrapper",
            "style": dimensions
        }));

        if (this._core.settings.lazyLoad) {
            srcType = 'data-src';
            lazyClass = 'owl-lazy';
        }

        // custom thumbnail
        if (customTn.length) {
            create(customTn.attr(srcType));
            customTn.remove();
            return false;
        }

        if (video.type === 'youtube') {
            path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
            create(path);
        } else if (video.type === 'vimeo') {
            $.ajax({
                type: 'GET',
                url: '//vimeo.com/api/v2/video/' + video.id + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    path = data[0].thumbnail_large;
                    create(path);
                }
            });
        } else if (video.type === 'vzaar') {
            $.ajax({
                type: 'GET',
                url: '//vzaar.com/api/videos/' + video.id + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    path = data.framegrab_url;
                    create(path);
                }
            });
        }
    };

	/**
	 * Stops the current video.
	 * @public
	 */
    Video.prototype.stop = function () {
        this._core.trigger('stop', null, 'video');
        this._playing.find('.owl-video-frame').remove();
        this._playing.removeClass('owl-video-playing');
        this._playing = null;
        this._core.leave('playing');
        this._core.trigger('stopped', null, 'video');
    };

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} event - The event arguments.
	 */
    Video.prototype.play = function (event) {
        var target = $(event.target),
            item = target.closest('.' + this._core.settings.itemClass),
            video = this._videos[item.attr('data-video')],
            width = video.width || '100%',
            height = video.height || this._core.$stage.height(),
            html,
            iframe;

        if (this._playing) {
            return;
        }

        this._core.enter('playing');
        this._core.trigger('play', null, 'video');

        item = this._core.items(this._core.relative(item.index()));

        this._core.reset(item.index());

        html = $('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>');
        html.attr('height', height);
        html.attr('width', width);
        if (video.type === 'youtube') {
            html.attr('src', '//www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0&v=' + video.id);
        } else if (video.type === 'vimeo') {
            html.attr('src', '//player.vimeo.com/video/' + video.id + '?autoplay=1');
        } else if (video.type === 'vzaar') {
            html.attr('src', '//view.vzaar.com/' + video.id + '/player?autoplay=true');
        }

        iframe = $(html).wrap('<div class="owl-video-frame" />').insertAfter(item.find('.owl-video'));

        this._playing = item.addClass('owl-video-playing');
    };

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
    Video.prototype.isInFullScreen = function () {
        var element = document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement;

        return element && $(element).parent().hasClass('owl-video-frame');
    };

	/**
	 * Destroys the plugin.
	 */
    Video.prototype.destroy = function () {
        var handler, property;

        this._core.$element.off('click.owl.video');

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
    var Animate = function (scope) {
        this.core = scope;
        this.core.options = $.extend({}, Animate.Defaults, this.core.options);
        this.swapping = true;
        this.previous = undefined;
        this.next = undefined;

        this.handlers = {
            'change.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name == 'position') {
                    this.previous = this.core.current();
                    this.next = e.property.value;
                }
            }, this),
            'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    this.swapping = e.type == 'translated';
                }
            }, this),
            'translate.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
                    this.swap();
                }
            }, this)
        };

        this.core.$element.on(this.handlers);
    };

	/**
	 * Default options.
	 * @public
	 */
    Animate.Defaults = {
        animateOut: false,
        animateIn: false
    };

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
    Animate.prototype.swap = function () {

        if (this.core.settings.items !== 1) {
            return;
        }

        if (!$.support.animation || !$.support.transition) {
            return;
        }

        this.core.speed(0);

        var left,
            clear = $.proxy(this.clear, this),
            previous = this.core.$stage.children().eq(this.previous),
            next = this.core.$stage.children().eq(this.next),
            incoming = this.core.settings.animateIn,
            outgoing = this.core.settings.animateOut;

        if (this.core.current() === this.previous) {
            return;
        }

        if (outgoing) {
            left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
            previous.one($.support.animation.end, clear)
                .css({ 'left': left + 'px' })
                .addClass('animated owl-animated-out')
                .addClass(outgoing);
        }

        if (incoming) {
            next.one($.support.animation.end, clear)
                .addClass('animated owl-animated-in')
                .addClass(incoming);
        }
    };

    Animate.prototype.clear = function (e) {
        $(e.target).css({ 'left': '' })
            .removeClass('animated owl-animated-out owl-animated-in')
            .removeClass(this.core.settings.animateIn)
            .removeClass(this.core.settings.animateOut);
        this.core.onTransitionEnd();
    };

	/**
	 * Destroys the plugin.
	 * @public
	 */
    Animate.prototype.destroy = function () {
        var handler, property;

        for (handler in this.handlers) {
            this.core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @author Tom De Caluwé
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
    var Autoplay = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * The autoplay timeout id.
		 * @type {Number}
		 */
        this._call = null;

		/**
		 * Depending on the state of the plugin, this variable contains either
		 * the start time of the timer or the current timer value if it's
		 * paused. Since we start in a paused state we initialize the timer
		 * value.
		 * @type {Number}
		 */
        this._time = 0;

		/**
		 * Stores the timeout currently used.
		 * @type {Number}
		 */
        this._timeout = 0;

		/**
		 * Indicates whenever the autoplay is paused.
		 * @type {Boolean}
		 */
        this._paused = true;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'settings') {
                    if (this._core.settings.autoplay) {
                        this.play();
                    } else {
                        this.stop();
                    }
                } else if (e.namespace && e.property.name === 'position' && this._paused) {
                    // Reset the timer. This code is triggered when the position
                    // of the carousel was changed through user interaction.
                    this._time = 0;
                }
            }, this),
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoplay) {
                    this.play();
                }
            }, this),
            'play.owl.autoplay': $.proxy(function (e, t, s) {
                if (e.namespace) {
                    this.play(t, s);
                }
            }, this),
            'stop.owl.autoplay': $.proxy(function (e) {
                if (e.namespace) {
                    this.stop();
                }
            }, this),
            'mouseover.owl.autoplay': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.pause();
                }
            }, this),
            'mouseleave.owl.autoplay': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.play();
                }
            }, this),
            'touchstart.owl.core': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.pause();
                }
            }, this),
            'touchend.owl.core': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause) {
                    this.play();
                }
            }, this)
        };

        // register event handlers
        this._core.$element.on(this._handlers);

        // set default options
        this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
    };

	/**
	 * Default options.
	 * @public
	 */
    Autoplay.Defaults = {
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        autoplaySpeed: false
    };

	/**
	 * Transition to the next slide and set a timeout for the next transition.
	 * @private
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
    Autoplay.prototype._next = function (speed) {
        this._call = window.setTimeout(
            $.proxy(this._next, this, speed),
            this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()
        );

        if (this._core.is('interacting') || document.hidden) {
            return;
        }
        this._core.next(speed || this._core.settings.autoplaySpeed);
    }

	/**
	 * Reads the current timer value when the timer is playing.
	 * @public
	 */
    Autoplay.prototype.read = function () {
        return new Date().getTime() - this._time;
    };

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
    Autoplay.prototype.play = function (timeout, speed) {
        var elapsed;

        if (!this._core.is('rotating')) {
            this._core.enter('rotating');
        }

        timeout = timeout || this._core.settings.autoplayTimeout;

        // Calculate the elapsed time since the last transition. If the carousel
        // wasn't playing this calculation will yield zero.
        elapsed = Math.min(this._time % (this._timeout || timeout), timeout);

        if (this._paused) {
            // Start the clock.
            this._time = this.read();
            this._paused = false;
        } else {
            // Clear the active timeout to allow replacement.
            window.clearTimeout(this._call);
        }

        // Adjust the origin of the timer to match the new timeout value.
        this._time += this.read() % timeout - elapsed;

        this._timeout = timeout;
        this._call = window.setTimeout($.proxy(this._next, this, speed), timeout - elapsed);
    };

	/**
	 * Stops the autoplay.
	 * @public
	 */
    Autoplay.prototype.stop = function () {
        if (this._core.is('rotating')) {
            // Reset the clock.
            this._time = 0;
            this._paused = true;

            window.clearTimeout(this._call);
            this._core.leave('rotating');
        }
    };

	/**
	 * Pauses the autoplay.
	 * @public
	 */
    Autoplay.prototype.pause = function () {
        if (this._core.is('rotating') && !this._paused) {
            // Pause the clock.
            this._time = this.read();
            this._paused = true;

            window.clearTimeout(this._call);
        }
    };

	/**
	 * Destroys the plugin.
	 */
    Autoplay.prototype.destroy = function () {
        var handler, property;

        this.stop();

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
    'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
    var Navigation = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
        this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
        this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
        this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
        this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
        this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
        this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        };

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'prepared.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
                        $(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
                }
            }, this),
            'added.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 0, this._templates.pop());
                }
            }, this),
            'remove.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 1);
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name == 'position') {
                    this.draw();
                }
            }, this),
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && !this._initialized) {
                    this._core.trigger('initialize', null, 'navigation');
                    this.initialize();
                    this.update();
                    this.draw();
                    this._initialized = true;
                    this._core.trigger('initialized', null, 'navigation');
                }
            }, this),
            'refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._initialized) {
                    this._core.trigger('refresh', null, 'navigation');
                    this.update();
                    this.draw();
                    this._core.trigger('refreshed', null, 'navigation');
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

        // register event handlers
        this.$element.on(this._handlers);
    };

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
    Navigation.Defaults = {
        nav: false,
        navText: [
            '<span aria-label="' + 'Previous' + '">&#x2039;</span>',
            '<span aria-label="' + 'Next' + '">&#x203a;</span>'
        ],
        navSpeed: false,
        navElement: 'button type="button" role="presentation"',
        navContainer: false,
        navContainerClass: 'owl-nav',
        navClass: [
            'owl-prev',
            'owl-next'
        ],
        slideBy: 1,
        dotClass: 'owl-dot',
        dotsClass: 'owl-dots',
        dots: true,
        dotsEach: false,
        dotsData: false,
        dotsSpeed: false,
        dotsContainer: false
    };

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
    Navigation.prototype.initialize = function () {
        var override,
            settings = this._core.settings;

        // create DOM structure for relative navigation
        this._controls.$relative = (settings.navContainer ? $(settings.navContainer)
            : $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled');

        this._controls.$previous = $('<' + settings.navElement + '>')
            .addClass(settings.navClass[0])
            .html(settings.navText[0])
            .prependTo(this._controls.$relative)
            .on('click', $.proxy(function (e) {
                this.prev(settings.navSpeed);
            }, this));
        this._controls.$next = $('<' + settings.navElement + '>')
            .addClass(settings.navClass[1])
            .html(settings.navText[1])
            .appendTo(this._controls.$relative)
            .on('click', $.proxy(function (e) {
                this.next(settings.navSpeed);
            }, this));

        // create DOM structure for absolute navigation
        if (!settings.dotsData) {
            this._templates = [$('<button role="button">')
                .addClass(settings.dotClass)
                .append($('<span>'))
                .prop('outerHTML')];
        }

        this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer)
            : $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled');

        this._controls.$absolute.on('click', 'button', $.proxy(function (e) {
            var index = $(e.target).parent().is(this._controls.$absolute)
                ? $(e.target).index() : $(e.target).parent().index();

            e.preventDefault();

            this.to(index, settings.dotsSpeed);
        }, this));

		/*$el.on('focusin', function() {
			$(document).off(".carousel");

			$(document).on('keydown.carousel', function(e) {
				if(e.keyCode == 37) {
					$el.trigger('prev.owl')
				}
				if(e.keyCode == 39) {
					$el.trigger('next.owl')
				}
			});
		});*/

        // override public methods of the carousel
        for (override in this._overrides) {
            this._core[override] = $.proxy(this[override], this);
        }
    };

	/**
	 * Destroys the plugin.
	 * @protected
	 */
    Navigation.prototype.destroy = function () {
        var handler, control, property, override, settings;
        settings = this._core.settings;

        for (handler in this._handlers) {
            this.$element.off(handler, this._handlers[handler]);
        }
        for (control in this._controls) {
            if (control === '$relative' && settings.navContainer) {
                this._controls[control].html('');
            } else {
                this._controls[control].remove();
            }
        }
        for (override in this.overides) {
            this._core[override] = this._overrides[override];
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

	/**
	 * Updates the internal state.
	 * @protected
	 */
    Navigation.prototype.update = function () {
        var i, j, k,
            lower = this._core.clones().length / 2,
            upper = lower + this._core.items().length,
            maximum = this._core.maximum(true),
            settings = this._core.settings,
            size = settings.center || settings.autoWidth || settings.dotsData
                ? 1 : settings.dotsEach || settings.items;

        if (settings.slideBy !== 'page') {
            settings.slideBy = Math.min(settings.slideBy, settings.items);
        }

        if (settings.dots || settings.slideBy == 'page') {
            this._pages = [];

            for (i = lower, j = 0, k = 0; i < upper; i++) {
                if (j >= size || j === 0) {
                    this._pages.push({
                        start: Math.min(maximum, i - lower),
                        end: i - lower + size - 1
                    });
                    if (Math.min(maximum, i - lower) === maximum) {
                        break;
                    }
                    j = 0, ++k;
                }
                j += this._core.mergers(this._core.relative(i));
            }
        }
    };

	/**
	 * Draws the user interface.
	 * @todo The option `dotsData` wont work.
	 * @protected
	 */
    Navigation.prototype.draw = function () {
        var difference,
            settings = this._core.settings,
            disabled = this._core.items().length <= settings.items,
            index = this._core.relative(this._core.current()),
            loop = settings.loop || settings.rewind;

        this._controls.$relative.toggleClass('disabled', !settings.nav || disabled);

        if (settings.nav) {
            this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true));
            this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true));
        }

        this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled);

        if (settings.dots) {
            difference = this._pages.length - this._controls.$absolute.children().length;

            if (settings.dotsData && difference !== 0) {
                this._controls.$absolute.html(this._templates.join(''));
            } else if (difference > 0) {
                this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
            } else if (difference < 0) {
                this._controls.$absolute.children().slice(difference).remove();
            }

            this._controls.$absolute.find('.active').removeClass('active');
            this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
        }
    };

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
    Navigation.prototype.onTrigger = function (event) {
        var settings = this._core.settings;

        event.page = {
            index: $.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: settings && (settings.center || settings.autoWidth || settings.dotsData
                ? 1 : settings.dotsEach || settings.items)
        };
    };

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
    Navigation.prototype.current = function () {
        var current = this._core.relative(this._core.current());
        return $.grep(this._pages, $.proxy(function (page, index) {
            return page.start <= current && page.end >= current;
        }, this)).pop();
    };

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
    Navigation.prototype.getPosition = function (successor) {
        var position, length,
            settings = this._core.settings;

        if (settings.slideBy == 'page') {
            position = $.inArray(this.current(), this._pages);
            length = this._pages.length;
            successor ? ++position : --position;
            position = this._pages[((position % length) + length) % length].start;
        } else {
            position = this._core.relative(this._core.current());
            length = this._core.items().length;
            successor ? position += settings.slideBy : position -= settings.slideBy;
        }

        return position;
    };

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
    Navigation.prototype.next = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
    };

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
    Navigation.prototype.prev = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
    };

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
    Navigation.prototype.to = function (position, speed, standard) {
        var length;

        if (!standard && this._pages.length) {
            length = this._pages.length;
            $.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
        } else {
            $.proxy(this._overrides.to, this._core)(position, speed);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
    'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Hash = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;

		/**
		 * Hash index for the items.
		 * @protected
		 * @type {Object}
		 */
        this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
        this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.startPosition === 'URLHash') {
                    $(window).trigger('hashchange.owl.navigation');
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');

                    if (!hash) {
                        return;
                    }

                    this._hashes[hash] = e.content;
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'position') {
                    var current = this._core.items(this._core.relative(this._core.current())),
                        hash = $.map(this._hashes, function (item, hash) {
                            return item === current ? hash : null;
                        }).join();

                    if (!hash || window.location.hash.slice(1) === hash) {
                        return;
                    }

                    window.location.hash = hash;
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Hash.Defaults, this._core.options);

        // register the event handlers
        this.$element.on(this._handlers);

        // register event listener for hash navigation
        $(window).on('hashchange.owl.navigation', $.proxy(function (e) {
            var hash = window.location.hash.substring(1),
                items = this._core.$stage.children(),
                position = this._hashes[hash] && items.index(this._hashes[hash]);

            if (position === undefined || position === this._core.current()) {
                return;
            }

            this._core.to(this._core.relative(position), false, true);
        }, this));
    };

	/**
	 * Default options.
	 * @public
	 */
    Hash.Defaults = {
        URLhashListener: false
    };

	/**
	 * Destroys the plugin.
	 * @public
	 */
    Hash.prototype.destroy = function () {
        var handler, property;

        $(window).off('hashchange.owl.navigation');

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);

/**
 * Support Plugin
 *
 * @version 2.3.4
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

    var style = $('<support>').get(0).style,
        prefixes = 'Webkit Moz O ms'.split(' '),
        events = {
            transition: {
                end: {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd',
                    transition: 'transitionend'
                }
            },
            animation: {
                end: {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    animation: 'animationend'
                }
            }
        },
        tests = {
            csstransforms: function () {
                return !!test('transform');
            },
            csstransforms3d: function () {
                return !!test('perspective');
            },
            csstransitions: function () {
                return !!test('transition');
            },
            cssanimations: function () {
                return !!test('animation');
            }
        };

    function test(property, prefixed) {
        var result = false,
            upper = property.charAt(0).toUpperCase() + property.slice(1);

        $.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function (i, property) {
            if (style[property] !== undefined) {
                result = prefixed ? property : true;
                return false;
            }
        });

        return result;
    }

    function prefixed(property) {
        return test(property, true);
    }

    if (tests.csstransitions()) {
        /* jshint -W053 */
        $.support.transition = new String(prefixed('transition'))
        $.support.transition.end = events.transition.end[$.support.transition];
    }

    if (tests.cssanimations()) {
        /* jshint -W053 */
        $.support.animation = new String(prefixed('animation'))
        $.support.animation.end = events.animation.end[$.support.animation];
    }

    if (tests.csstransforms()) {
        /* jshint -W053 */
        $.support.transform = new String(prefixed('transform'));
        $.support.transform3d = tests.csstransforms3d();
    }

})(window.Zepto || window.jQuery, window, document);

;(function(d){var n={speed:3000,pause:0,showItems:0,mousePause:!0,height:310,animate:!0,margin:0,padding:0,startPaused:!1},c={moveUp:function(a,b){c.animate(a,b,"up")},moveDown:function(a,b){c.animate(a,b,"down")},animate:function(a,b,e){var c=a.itemHeight,f=a.options,k=a.element,g=k.children("ul"),l="up"===e?"li:first":"li:last";k.trigger("vticker.beforeTick");var m=g.children(l).clone(!0);0<f.height&&(c=g.children("li:first").height());c+=f.margin+2*f.padding;"down"===e&&g.css("top","-"+c+"px").prepend(m);if(b&&b.animate){if(a.animating)return;a.animating=!0;g.animate("up"===e?{top:"-="+c+"px"}:{top:0},f.speed,function(){d(g).children(l).remove();d(g).css("top","0px");a.animating=!1;k.trigger("vticker.afterTick")})}else g.children(l).remove(),g.css("top","0px"),k.trigger("vticker.afterTick");"up"===e&&m.appendTo(g)},nextUsePause:function(){var a=d(this).data("state"),b=a.options;a.isPaused||2>a.itemCount||f.next.call(this,{animate:b.animate})},startInterval:function(){var a=d(this).data("state"),b=this;a.intervalId=setInterval(function(){c.nextUsePause.call(b)},a.options.pause)},stopInterval:function(){var a=d(this).data("state");a&&(a.intervalId&&clearInterval(a.intervalId),a.intervalId=void 0)},restartInterval:function(){c.stopInterval.call(this);c.startInterval.call(this)}},f={init:function(a){f.stop.call(this);var b=jQuery.extend({},n);a=d.extend(b,a);var b=d(this),e={itemCount:b.children("ul").children("li").length,itemHeight:0,itemMargin:0,element:b,animating:!1,options:a,isPaused:a.startPaused?!0:!1,pausedByCode:!1};d(this).data("state",e);b.css({overflow:"hidden",position:"relative"}).children("ul").css({position:"absolute",margin:0,padding:0}).children("li").css({margin:a.margin,padding:a.padding});isNaN(a.height)||0===a.height?(b.children("ul").children("li").each(function(){var a=d(this);a.height()>e.itemHeight&&(e.itemHeight=a.height())}),b.children("ul").children("li").each(function(){d(this).height(e.itemHeight)}),b.height((e.itemHeight+(a.margin+2*a.padding))*a.showItems+a.margin)):b.height(a.height);var h=this;a.startPaused||c.startInterval.call(h);a.mousePause&&b.bind("mouseenter",function(){!0!==e.isPaused&&(e.pausedByCode=!0,c.stopInterval.call(h),f.pause.call(h,!0))}).bind("mouseleave",function(){if(!0!==e.isPaused||e.pausedByCode)e.pausedByCode=!1,f.pause.call(h,!1),c.startInterval.call(h)})},pause:function(a){var b=d(this).data("state");if(b){if(2>b.itemCount)return!1;b.isPaused=a;b=b.element;a?(d(this).addClass("paused"),b.trigger("vticker.pause")):(d(this).removeClass("paused"),b.trigger("vticker.resume"))}},next:function(a){var b=d(this).data("state");if(b){if(b.animating||2>b.itemCount)return!1;c.restartInterval.call(this);c.moveUp(b,a)}},prev:function(a){var b=d(this).data("state");if(b){if(b.animating||2>b.itemCount)return!1;c.restartInterval.call(this);c.moveDown(b,a)}},stop:function(){d(this).data("state")&&c.stopInterval.call(this)},remove:function(){var a=d(this).data("state");a&&(c.stopInterval.call(this),a=a.element,a.unbind(),a.remove())}};d.fn.vTicker=function(a){if(f[a])return f[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"!==typeof a&&a)d.error("Method "+a+" does not exist on jQuery.vTicker");else return f.init.apply(this,arguments)}})(jQuery);;jQuery(document).ready(function($){$('.sp-news-scrolling-slider').each(function(index){var slider_id=$(this).attr('id');var slider_conf=$.parseJSON($(this).attr('data-conf'));jQuery('#'+slider_id).vTicker({speed:parseInt(slider_conf.speed),height:parseInt(slider_conf.height),padding:10,pause:parseInt(slider_conf.pause)});});});;
/*!
  * Bootstrap v4.0.0 (https://getbootstrap.com)
  * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?factory(exports,require('jquery'),require('popper.js')):typeof define==='function'&&define.amd?define(['exports','jquery','popper.js'],factory):(factory((global.bootstrap={}),global.jQuery,global.Popper));}(this,(function(exports,$,Popper){'use strict';$=$&&$.hasOwnProperty('default')?$['default']:$;Popper=Popper&&Popper.hasOwnProperty('default')?Popper['default']:Popper;function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}
function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor;}
function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}
return target;};return _extends.apply(this,arguments);}
function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}
var Util=function($$$1){var transition=false;var MAX_UID=1000000;function toType(obj){return{}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();}
function getSpecialTransitionEndEvent(){return{bindType:transition.end,delegateType:transition.end,handle:function handle(event){if($$$1(event.target).is(this)){return event.handleObj.handler.apply(this,arguments);}
return undefined;}};}
function transitionEndTest(){if(typeof window!=='undefined'&&window.QUnit){return false;}
return{end:'transitionend'};}
function transitionEndEmulator(duration){var _this=this;var called=false;$$$1(this).one(Util.TRANSITION_END,function(){called=true;});setTimeout(function(){if(!called){Util.triggerTransitionEnd(_this);}},duration);return this;}
function setTransitionEndSupport(){transition=transitionEndTest();$$$1.fn.emulateTransitionEnd=transitionEndEmulator;if(Util.supportsTransitionEnd()){$$$1.event.special[Util.TRANSITION_END]=getSpecialTransitionEndEvent();}}
function escapeId(selector){selector=typeof $$$1.escapeSelector==='function'?$$$1.escapeSelector(selector).substr(1):selector.replace(/(:|\.|\[|\]|,|=|@)/g,'\\$1');return selector;}
var Util={TRANSITION_END:'bsTransitionEnd',getUID:function getUID(prefix){do{prefix+=~~(Math.random()*MAX_UID);}while(document.getElementById(prefix));return prefix;},getSelectorFromElement:function getSelectorFromElement(element){var selector=element.getAttribute('data-target');if(!selector||selector==='#'){selector=element.getAttribute('href')||'';}
if(selector.charAt(0)==='#'){selector=escapeId(selector);}
try{var $selector=$$$1(document).find(selector);return $selector.length>0?selector:null;}catch(err){return null;}},reflow:function reflow(element){return element.offsetHeight;},triggerTransitionEnd:function triggerTransitionEnd(element){$$$1(element).trigger(transition.end);},supportsTransitionEnd:function supportsTransitionEnd(){return Boolean(transition);},isElement:function isElement(obj){return(obj[0]||obj).nodeType;},typeCheckConfig:function typeCheckConfig(componentName,config,configTypes){for(var property in configTypes){if(Object.prototype.hasOwnProperty.call(configTypes,property)){var expectedTypes=configTypes[property];var value=config[property];var valueType=value&&Util.isElement(value)?'element':toType(value);if(!new RegExp(expectedTypes).test(valueType)){throw new Error(componentName.toUpperCase()+": "+("Option \""+property+"\" provided type \""+valueType+"\" ")+("but expected type \""+expectedTypes+"\"."));}}}}};setTransitionEndSupport();return Util;}($);var Alert=function($$$1){var NAME='alert';var VERSION='4.0.0';var DATA_KEY='bs.alert';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=150;var Selector={DISMISS:'[data-dismiss="alert"]'};var Event={CLOSE:"close"+EVENT_KEY,CLOSED:"closed"+EVENT_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY};var ClassName={ALERT:'alert',FADE:'fade',SHOW:'show'};var Alert=function(){function Alert(element){this._element=element;}
var _proto=Alert.prototype;_proto.close=function close(element){element=element||this._element;var rootElement=this._getRootElement(element);var customEvent=this._triggerCloseEvent(rootElement);if(customEvent.isDefaultPrevented()){return;}
this._removeElement(rootElement);};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);this._element=null;};_proto._getRootElement=function _getRootElement(element){var selector=Util.getSelectorFromElement(element);var parent=false;if(selector){parent=$$$1(selector)[0];}
if(!parent){parent=$$$1(element).closest("."+ClassName.ALERT)[0];}
return parent;};_proto._triggerCloseEvent=function _triggerCloseEvent(element){var closeEvent=$$$1.Event(Event.CLOSE);$$$1(element).trigger(closeEvent);return closeEvent;};_proto._removeElement=function _removeElement(element){var _this=this;$$$1(element).removeClass(ClassName.SHOW);if(!Util.supportsTransitionEnd()||!$$$1(element).hasClass(ClassName.FADE)){this._destroyElement(element);return;}
$$$1(element).one(Util.TRANSITION_END,function(event){return _this._destroyElement(element,event);}).emulateTransitionEnd(TRANSITION_DURATION);};_proto._destroyElement=function _destroyElement(element){$$$1(element).detach().trigger(Event.CLOSED).remove();};Alert._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var $element=$$$1(this);var data=$element.data(DATA_KEY);if(!data){data=new Alert(this);$element.data(DATA_KEY,data);}
if(config==='close'){data[config](this);}});};Alert._handleDismiss=function _handleDismiss(alertInstance){return function(event){if(event){event.preventDefault();}
alertInstance.close(this);};};_createClass(Alert,null,[{key:"VERSION",get:function get(){return VERSION;}}]);return Alert;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DISMISS,Alert._handleDismiss(new Alert()));$$$1.fn[NAME]=Alert._jQueryInterface;$$$1.fn[NAME].Constructor=Alert;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Alert._jQueryInterface;};return Alert;}($);var Button=function($$$1){var NAME='button';var VERSION='4.0.0';var DATA_KEY='bs.button';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var ClassName={ACTIVE:'active',BUTTON:'btn',FOCUS:'focus'};var Selector={DATA_TOGGLE_CARROT:'[data-toggle^="button"]',DATA_TOGGLE:'[data-toggle="buttons"]',INPUT:'input',ACTIVE:'.active',BUTTON:'.btn'};var Event={CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY,FOCUS_BLUR_DATA_API:"focus"+EVENT_KEY+DATA_API_KEY+" "+("blur"+EVENT_KEY+DATA_API_KEY)};var Button=function(){function Button(element){this._element=element;}
var _proto=Button.prototype;_proto.toggle=function toggle(){var triggerChangeEvent=true;var addAriaPressed=true;var rootElement=$$$1(this._element).closest(Selector.DATA_TOGGLE)[0];if(rootElement){var input=$$$1(this._element).find(Selector.INPUT)[0];if(input){if(input.type==='radio'){if(input.checked&&$$$1(this._element).hasClass(ClassName.ACTIVE)){triggerChangeEvent=false;}else{var activeElement=$$$1(rootElement).find(Selector.ACTIVE)[0];if(activeElement){$$$1(activeElement).removeClass(ClassName.ACTIVE);}}}
if(triggerChangeEvent){if(input.hasAttribute('disabled')||rootElement.hasAttribute('disabled')||input.classList.contains('disabled')||rootElement.classList.contains('disabled')){return;}
input.checked=!$$$1(this._element).hasClass(ClassName.ACTIVE);$$$1(input).trigger('change');}
input.focus();addAriaPressed=false;}}
if(addAriaPressed){this._element.setAttribute('aria-pressed',!$$$1(this._element).hasClass(ClassName.ACTIVE));}
if(triggerChangeEvent){$$$1(this._element).toggleClass(ClassName.ACTIVE);}};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);this._element=null;};Button._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);if(!data){data=new Button(this);$$$1(this).data(DATA_KEY,data);}
if(config==='toggle'){data[config]();}});};_createClass(Button,null,[{key:"VERSION",get:function get(){return VERSION;}}]);return Button;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DATA_TOGGLE_CARROT,function(event){event.preventDefault();var button=event.target;if(!$$$1(button).hasClass(ClassName.BUTTON)){button=$$$1(button).closest(Selector.BUTTON);}
Button._jQueryInterface.call($$$1(button),'toggle');}).on(Event.FOCUS_BLUR_DATA_API,Selector.DATA_TOGGLE_CARROT,function(event){var button=$$$1(event.target).closest(Selector.BUTTON)[0];$$$1(button).toggleClass(ClassName.FOCUS,/^focus(in)?$/.test(event.type));});$$$1.fn[NAME]=Button._jQueryInterface;$$$1.fn[NAME].Constructor=Button;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Button._jQueryInterface;};return Button;}($);var Carousel=function($$$1){var NAME='carousel';var VERSION='4.0.0';var DATA_KEY='bs.carousel';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=600;var ARROW_LEFT_KEYCODE=37;var ARROW_RIGHT_KEYCODE=39;var TOUCHEVENT_COMPAT_WAIT=500;var Default={interval:5000,keyboard:true,slide:false,pause:'hover',wrap:true};var DefaultType={interval:'(number|boolean)',keyboard:'boolean',slide:'(boolean|string)',pause:'(string|boolean)',wrap:'boolean'};var Direction={NEXT:'next',PREV:'prev',LEFT:'left',RIGHT:'right'};var Event={SLIDE:"slide"+EVENT_KEY,SLID:"slid"+EVENT_KEY,KEYDOWN:"keydown"+EVENT_KEY,MOUSEENTER:"mouseenter"+EVENT_KEY,MOUSELEAVE:"mouseleave"+EVENT_KEY,TOUCHEND:"touchend"+EVENT_KEY,LOAD_DATA_API:"load"+EVENT_KEY+DATA_API_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY};var ClassName={CAROUSEL:'carousel',ACTIVE:'active',SLIDE:'slide',RIGHT:'carousel-item-right',LEFT:'carousel-item-left',NEXT:'carousel-item-next',PREV:'carousel-item-prev',ITEM:'carousel-item'};var Selector={ACTIVE:'.active',ACTIVE_ITEM:'.active.carousel-item',ITEM:'.carousel-item',NEXT_PREV:'.carousel-item-next, .carousel-item-prev',INDICATORS:'.carousel-indicators',DATA_SLIDE:'[data-slide], [data-slide-to]',DATA_RIDE:'[data-ride="carousel"]'};var Carousel=function(){function Carousel(element,config){this._items=null;this._interval=null;this._activeElement=null;this._isPaused=false;this._isSliding=false;this.touchTimeout=null;this._config=this._getConfig(config);this._element=$$$1(element)[0];this._indicatorsElement=$$$1(this._element).find(Selector.INDICATORS)[0];this._addEventListeners();}
var _proto=Carousel.prototype;_proto.next=function next(){if(!this._isSliding){this._slide(Direction.NEXT);}};_proto.nextWhenVisible=function nextWhenVisible(){if(!document.hidden&&$$$1(this._element).is(':visible')&&$$$1(this._element).css('visibility')!=='hidden'){this.next();}};_proto.prev=function prev(){if(!this._isSliding){this._slide(Direction.PREV);}};_proto.pause=function pause(event){if(!event){this._isPaused=true;}
if($$$1(this._element).find(Selector.NEXT_PREV)[0]&&Util.supportsTransitionEnd()){Util.triggerTransitionEnd(this._element);this.cycle(true);}
clearInterval(this._interval);this._interval=null;};_proto.cycle=function cycle(event){if(!event){this._isPaused=false;}
if(this._interval){clearInterval(this._interval);this._interval=null;}
if(this._config.interval&&!this._isPaused){this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval);}};_proto.to=function to(index){var _this=this;this._activeElement=$$$1(this._element).find(Selector.ACTIVE_ITEM)[0];var activeIndex=this._getItemIndex(this._activeElement);if(index>this._items.length-1||index<0){return;}
if(this._isSliding){$$$1(this._element).one(Event.SLID,function(){return _this.to(index);});return;}
if(activeIndex===index){this.pause();this.cycle();return;}
var direction=index>activeIndex?Direction.NEXT:Direction.PREV;this._slide(direction,this._items[index]);};_proto.dispose=function dispose(){$$$1(this._element).off(EVENT_KEY);$$$1.removeData(this._element,DATA_KEY);this._items=null;this._config=null;this._element=null;this._interval=null;this._isPaused=null;this._isSliding=null;this._activeElement=null;this._indicatorsElement=null;};_proto._getConfig=function _getConfig(config){config=_extends({},Default,config);Util.typeCheckConfig(NAME,config,DefaultType);return config;};_proto._addEventListeners=function _addEventListeners(){var _this2=this;if(this._config.keyboard){$$$1(this._element).on(Event.KEYDOWN,function(event){return _this2._keydown(event);});}
if(this._config.pause==='hover'){$$$1(this._element).on(Event.MOUSEENTER,function(event){return _this2.pause(event);}).on(Event.MOUSELEAVE,function(event){return _this2.cycle(event);});if('ontouchstart'in document.documentElement){$$$1(this._element).on(Event.TOUCHEND,function(){_this2.pause();if(_this2.touchTimeout){clearTimeout(_this2.touchTimeout);}
_this2.touchTimeout=setTimeout(function(event){return _this2.cycle(event);},TOUCHEVENT_COMPAT_WAIT+_this2._config.interval);});}}};_proto._keydown=function _keydown(event){if(/input|textarea/i.test(event.target.tagName)){return;}
switch(event.which){case ARROW_LEFT_KEYCODE:event.preventDefault();this.prev();break;case ARROW_RIGHT_KEYCODE:event.preventDefault();this.next();break;default:}};_proto._getItemIndex=function _getItemIndex(element){this._items=$$$1.makeArray($$$1(element).parent().find(Selector.ITEM));return this._items.indexOf(element);};_proto._getItemByDirection=function _getItemByDirection(direction,activeElement){var isNextDirection=direction===Direction.NEXT;var isPrevDirection=direction===Direction.PREV;var activeIndex=this._getItemIndex(activeElement);var lastItemIndex=this._items.length-1;var isGoingToWrap=isPrevDirection&&activeIndex===0||isNextDirection&&activeIndex===lastItemIndex;if(isGoingToWrap&&!this._config.wrap){return activeElement;}
var delta=direction===Direction.PREV?-1:1;var itemIndex=(activeIndex+delta)%this._items.length;return itemIndex===-1?this._items[this._items.length-1]:this._items[itemIndex];};_proto._triggerSlideEvent=function _triggerSlideEvent(relatedTarget,eventDirectionName){var targetIndex=this._getItemIndex(relatedTarget);var fromIndex=this._getItemIndex($$$1(this._element).find(Selector.ACTIVE_ITEM)[0]);var slideEvent=$$$1.Event(Event.SLIDE,{relatedTarget:relatedTarget,direction:eventDirectionName,from:fromIndex,to:targetIndex});$$$1(this._element).trigger(slideEvent);return slideEvent;};_proto._setActiveIndicatorElement=function _setActiveIndicatorElement(element){if(this._indicatorsElement){$$$1(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);var nextIndicator=this._indicatorsElement.children[this._getItemIndex(element)];if(nextIndicator){$$$1(nextIndicator).addClass(ClassName.ACTIVE);}}};_proto._slide=function _slide(direction,element){var _this3=this;var activeElement=$$$1(this._element).find(Selector.ACTIVE_ITEM)[0];var activeElementIndex=this._getItemIndex(activeElement);var nextElement=element||activeElement&&this._getItemByDirection(direction,activeElement);var nextElementIndex=this._getItemIndex(nextElement);var isCycling=Boolean(this._interval);var directionalClassName;var orderClassName;var eventDirectionName;if(direction===Direction.NEXT){directionalClassName=ClassName.LEFT;orderClassName=ClassName.NEXT;eventDirectionName=Direction.LEFT;}else{directionalClassName=ClassName.RIGHT;orderClassName=ClassName.PREV;eventDirectionName=Direction.RIGHT;}
if(nextElement&&$$$1(nextElement).hasClass(ClassName.ACTIVE)){this._isSliding=false;return;}
var slideEvent=this._triggerSlideEvent(nextElement,eventDirectionName);if(slideEvent.isDefaultPrevented()){return;}
if(!activeElement||!nextElement){return;}
this._isSliding=true;if(isCycling){this.pause();}
this._setActiveIndicatorElement(nextElement);var slidEvent=$$$1.Event(Event.SLID,{relatedTarget:nextElement,direction:eventDirectionName,from:activeElementIndex,to:nextElementIndex});if(Util.supportsTransitionEnd()&&$$$1(this._element).hasClass(ClassName.SLIDE)){$$$1(nextElement).addClass(orderClassName);Util.reflow(nextElement);$$$1(activeElement).addClass(directionalClassName);$$$1(nextElement).addClass(directionalClassName);$$$1(activeElement).one(Util.TRANSITION_END,function(){$$$1(nextElement).removeClass(directionalClassName+" "+orderClassName).addClass(ClassName.ACTIVE);$$$1(activeElement).removeClass(ClassName.ACTIVE+" "+orderClassName+" "+directionalClassName);_this3._isSliding=false;setTimeout(function(){return $$$1(_this3._element).trigger(slidEvent);},0);}).emulateTransitionEnd(TRANSITION_DURATION);}else{$$$1(activeElement).removeClass(ClassName.ACTIVE);$$$1(nextElement).addClass(ClassName.ACTIVE);this._isSliding=false;$$$1(this._element).trigger(slidEvent);}
if(isCycling){this.cycle();}};Carousel._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=_extends({},Default,$$$1(this).data());if(typeof config==='object'){_config=_extends({},_config,config);}
var action=typeof config==='string'?config:_config.slide;if(!data){data=new Carousel(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='number'){data.to(config);}else if(typeof action==='string'){if(typeof data[action]==='undefined'){throw new TypeError("No method named \""+action+"\"");}
data[action]();}else if(_config.interval){data.pause();data.cycle();}});};Carousel._dataApiClickHandler=function _dataApiClickHandler(event){var selector=Util.getSelectorFromElement(this);if(!selector){return;}
var target=$$$1(selector)[0];if(!target||!$$$1(target).hasClass(ClassName.CAROUSEL)){return;}
var config=_extends({},$$$1(target).data(),$$$1(this).data());var slideIndex=this.getAttribute('data-slide-to');if(slideIndex){config.interval=false;}
Carousel._jQueryInterface.call($$$1(target),config);if(slideIndex){$$$1(target).data(DATA_KEY).to(slideIndex);}
event.preventDefault();};_createClass(Carousel,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}}]);return Carousel;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DATA_SLIDE,Carousel._dataApiClickHandler);$$$1(window).on(Event.LOAD_DATA_API,function(){$$$1(Selector.DATA_RIDE).each(function(){var $carousel=$$$1(this);Carousel._jQueryInterface.call($carousel,$carousel.data());});});$$$1.fn[NAME]=Carousel._jQueryInterface;$$$1.fn[NAME].Constructor=Carousel;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Carousel._jQueryInterface;};return Carousel;}($);var Collapse=function($$$1){var NAME='collapse';var VERSION='4.0.0';var DATA_KEY='bs.collapse';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=600;var Default={toggle:true,parent:''};var DefaultType={toggle:'boolean',parent:'(string|element)'};var Event={SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY};var ClassName={SHOW:'show',COLLAPSE:'collapse',COLLAPSING:'collapsing',COLLAPSED:'collapsed'};var Dimension={WIDTH:'width',HEIGHT:'height'};var Selector={ACTIVES:'.show, .collapsing',DATA_TOGGLE:'[data-toggle="collapse"]'};var Collapse=function(){function Collapse(element,config){this._isTransitioning=false;this._element=element;this._config=this._getConfig(config);this._triggerArray=$$$1.makeArray($$$1("[data-toggle=\"collapse\"][href=\"#"+element.id+"\"],"+("[data-toggle=\"collapse\"][data-target=\"#"+element.id+"\"]")));var tabToggles=$$$1(Selector.DATA_TOGGLE);for(var i=0;i<tabToggles.length;i++){var elem=tabToggles[i];var selector=Util.getSelectorFromElement(elem);if(selector!==null&&$$$1(selector).filter(element).length>0){this._selector=selector;this._triggerArray.push(elem);}}
this._parent=this._config.parent?this._getParent():null;if(!this._config.parent){this._addAriaAndCollapsedClass(this._element,this._triggerArray);}
if(this._config.toggle){this.toggle();}}
var _proto=Collapse.prototype;_proto.toggle=function toggle(){if($$$1(this._element).hasClass(ClassName.SHOW)){this.hide();}else{this.show();}};_proto.show=function show(){var _this=this;if(this._isTransitioning||$$$1(this._element).hasClass(ClassName.SHOW)){return;}
var actives;var activesData;if(this._parent){actives=$$$1.makeArray($$$1(this._parent).find(Selector.ACTIVES).filter("[data-parent=\""+this._config.parent+"\"]"));if(actives.length===0){actives=null;}}
if(actives){activesData=$$$1(actives).not(this._selector).data(DATA_KEY);if(activesData&&activesData._isTransitioning){return;}}
var startEvent=$$$1.Event(Event.SHOW);$$$1(this._element).trigger(startEvent);if(startEvent.isDefaultPrevented()){return;}
if(actives){Collapse._jQueryInterface.call($$$1(actives).not(this._selector),'hide');if(!activesData){$$$1(actives).data(DATA_KEY,null);}}
var dimension=this._getDimension();$$$1(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);this._element.style[dimension]=0;if(this._triggerArray.length>0){$$$1(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded',true);}
this.setTransitioning(true);var complete=function complete(){$$$1(_this._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);_this._element.style[dimension]='';_this.setTransitioning(false);$$$1(_this._element).trigger(Event.SHOWN);};if(!Util.supportsTransitionEnd()){complete();return;}
var capitalizedDimension=dimension[0].toUpperCase()+dimension.slice(1);var scrollSize="scroll"+capitalizedDimension;$$$1(this._element).one(Util.TRANSITION_END,complete).emulateTransitionEnd(TRANSITION_DURATION);this._element.style[dimension]=this._element[scrollSize]+"px";};_proto.hide=function hide(){var _this2=this;if(this._isTransitioning||!$$$1(this._element).hasClass(ClassName.SHOW)){return;}
var startEvent=$$$1.Event(Event.HIDE);$$$1(this._element).trigger(startEvent);if(startEvent.isDefaultPrevented()){return;}
var dimension=this._getDimension();this._element.style[dimension]=this._element.getBoundingClientRect()[dimension]+"px";Util.reflow(this._element);$$$1(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);if(this._triggerArray.length>0){for(var i=0;i<this._triggerArray.length;i++){var trigger=this._triggerArray[i];var selector=Util.getSelectorFromElement(trigger);if(selector!==null){var $elem=$$$1(selector);if(!$elem.hasClass(ClassName.SHOW)){$$$1(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded',false);}}}}
this.setTransitioning(true);var complete=function complete(){_this2.setTransitioning(false);$$$1(_this2._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);};this._element.style[dimension]='';if(!Util.supportsTransitionEnd()){complete();return;}
$$$1(this._element).one(Util.TRANSITION_END,complete).emulateTransitionEnd(TRANSITION_DURATION);};_proto.setTransitioning=function setTransitioning(isTransitioning){this._isTransitioning=isTransitioning;};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);this._config=null;this._parent=null;this._element=null;this._triggerArray=null;this._isTransitioning=null;};_proto._getConfig=function _getConfig(config){config=_extends({},Default,config);config.toggle=Boolean(config.toggle);Util.typeCheckConfig(NAME,config,DefaultType);return config;};_proto._getDimension=function _getDimension(){var hasWidth=$$$1(this._element).hasClass(Dimension.WIDTH);return hasWidth?Dimension.WIDTH:Dimension.HEIGHT;};_proto._getParent=function _getParent(){var _this3=this;var parent=null;if(Util.isElement(this._config.parent)){parent=this._config.parent;if(typeof this._config.parent.jquery!=='undefined'){parent=this._config.parent[0];}}else{parent=$$$1(this._config.parent)[0];}
var selector="[data-toggle=\"collapse\"][data-parent=\""+this._config.parent+"\"]";$$$1(parent).find(selector).each(function(i,element){_this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element),[element]);});return parent;};_proto._addAriaAndCollapsedClass=function _addAriaAndCollapsedClass(element,triggerArray){if(element){var isOpen=$$$1(element).hasClass(ClassName.SHOW);if(triggerArray.length>0){$$$1(triggerArray).toggleClass(ClassName.COLLAPSED,!isOpen).attr('aria-expanded',isOpen);}}};Collapse._getTargetFromElement=function _getTargetFromElement(element){var selector=Util.getSelectorFromElement(element);return selector?$$$1(selector)[0]:null;};Collapse._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var $this=$$$1(this);var data=$this.data(DATA_KEY);var _config=_extends({},Default,$this.data(),typeof config==='object'&&config);if(!data&&_config.toggle&&/show|hide/.test(config)){_config.toggle=false;}
if(!data){data=new Collapse(this,_config);$this.data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};_createClass(Collapse,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}}]);return Collapse;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DATA_TOGGLE,function(event){if(event.currentTarget.tagName==='A'){event.preventDefault();}
var $trigger=$$$1(this);var selector=Util.getSelectorFromElement(this);$$$1(selector).each(function(){var $target=$$$1(this);var data=$target.data(DATA_KEY);var config=data?'toggle':$trigger.data();Collapse._jQueryInterface.call($target,config);});});$$$1.fn[NAME]=Collapse._jQueryInterface;$$$1.fn[NAME].Constructor=Collapse;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Collapse._jQueryInterface;};return Collapse;}($);var Dropdown=function($$$1){var NAME='dropdown';var VERSION='4.0.0';var DATA_KEY='bs.dropdown';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var ESCAPE_KEYCODE=27;var SPACE_KEYCODE=32;var TAB_KEYCODE=9;var ARROW_UP_KEYCODE=38;var ARROW_DOWN_KEYCODE=40;var RIGHT_MOUSE_BUTTON_WHICH=3;var REGEXP_KEYDOWN=new RegExp(ARROW_UP_KEYCODE+"|"+ARROW_DOWN_KEYCODE+"|"+ESCAPE_KEYCODE);var Event={HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,CLICK:"click"+EVENT_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY,KEYDOWN_DATA_API:"keydown"+EVENT_KEY+DATA_API_KEY,KEYUP_DATA_API:"keyup"+EVENT_KEY+DATA_API_KEY};var ClassName={DISABLED:'disabled',SHOW:'show',DROPUP:'dropup',DROPRIGHT:'dropright',DROPLEFT:'dropleft',MENURIGHT:'dropdown-menu-right',MENULEFT:'dropdown-menu-left',POSITION_STATIC:'position-static'};var Selector={DATA_TOGGLE:'[data-toggle="dropdown"]',FORM_CHILD:'.dropdown form',MENU:'.dropdown-menu',NAVBAR_NAV:'.navbar-nav',VISIBLE_ITEMS:'.dropdown-menu .dropdown-item:not(.disabled)'};var AttachmentMap={TOP:'top-start',TOPEND:'top-end',BOTTOM:'bottom-start',BOTTOMEND:'bottom-end',RIGHT:'right-start',RIGHTEND:'right-end',LEFT:'left-start',LEFTEND:'left-end'};var Default={offset:0,flip:true,boundary:'scrollParent'};var DefaultType={offset:'(number|string|function)',flip:'boolean',boundary:'(string|element)'};var Dropdown=function(){function Dropdown(element,config){this._element=element;this._popper=null;this._config=this._getConfig(config);this._menu=this._getMenuElement();this._inNavbar=this._detectNavbar();this._addEventListeners();}
var _proto=Dropdown.prototype;_proto.toggle=function toggle(){if(this._element.disabled||$$$1(this._element).hasClass(ClassName.DISABLED)){return;}
var parent=Dropdown._getParentFromElement(this._element);var isActive=$$$1(this._menu).hasClass(ClassName.SHOW);Dropdown._clearMenus();if(isActive){return;}
var relatedTarget={relatedTarget:this._element};var showEvent=$$$1.Event(Event.SHOW,relatedTarget);$$$1(parent).trigger(showEvent);if(showEvent.isDefaultPrevented()){return;}
if(!this._inNavbar){if(typeof Popper==='undefined'){throw new TypeError('Bootstrap dropdown require Popper.js (https://popper.js.org)');}
var element=this._element;if($$$1(parent).hasClass(ClassName.DROPUP)){if($$$1(this._menu).hasClass(ClassName.MENULEFT)||$$$1(this._menu).hasClass(ClassName.MENURIGHT)){element=parent;}}
if(this._config.boundary!=='scrollParent'){$$$1(parent).addClass(ClassName.POSITION_STATIC);}
this._popper=new Popper(element,this._menu,this._getPopperConfig());}
if('ontouchstart'in document.documentElement&&$$$1(parent).closest(Selector.NAVBAR_NAV).length===0){$$$1('body').children().on('mouseover',null,$$$1.noop);}
this._element.focus();this._element.setAttribute('aria-expanded',true);$$$1(this._menu).toggleClass(ClassName.SHOW);$$$1(parent).toggleClass(ClassName.SHOW).trigger($$$1.Event(Event.SHOWN,relatedTarget));};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);$$$1(this._element).off(EVENT_KEY);this._element=null;this._menu=null;if(this._popper!==null){this._popper.destroy();this._popper=null;}};_proto.update=function update(){this._inNavbar=this._detectNavbar();if(this._popper!==null){this._popper.scheduleUpdate();}};_proto._addEventListeners=function _addEventListeners(){var _this=this;$$$1(this._element).on(Event.CLICK,function(event){event.preventDefault();event.stopPropagation();_this.toggle();});};_proto._getConfig=function _getConfig(config){config=_extends({},this.constructor.Default,$$$1(this._element).data(),config);Util.typeCheckConfig(NAME,config,this.constructor.DefaultType);return config;};_proto._getMenuElement=function _getMenuElement(){if(!this._menu){var parent=Dropdown._getParentFromElement(this._element);this._menu=$$$1(parent).find(Selector.MENU)[0];}
return this._menu;};_proto._getPlacement=function _getPlacement(){var $parentDropdown=$$$1(this._element).parent();var placement=AttachmentMap.BOTTOM;if($parentDropdown.hasClass(ClassName.DROPUP)){placement=AttachmentMap.TOP;if($$$1(this._menu).hasClass(ClassName.MENURIGHT)){placement=AttachmentMap.TOPEND;}}else if($parentDropdown.hasClass(ClassName.DROPRIGHT)){placement=AttachmentMap.RIGHT;}else if($parentDropdown.hasClass(ClassName.DROPLEFT)){placement=AttachmentMap.LEFT;}else if($$$1(this._menu).hasClass(ClassName.MENURIGHT)){placement=AttachmentMap.BOTTOMEND;}
return placement;};_proto._detectNavbar=function _detectNavbar(){return $$$1(this._element).closest('.navbar').length>0;};_proto._getPopperConfig=function _getPopperConfig(){var _this2=this;var offsetConf={};if(typeof this._config.offset==='function'){offsetConf.fn=function(data){data.offsets=_extends({},data.offsets,_this2._config.offset(data.offsets)||{});return data;};}else{offsetConf.offset=this._config.offset;}
var popperConfig={placement:this._getPlacement(),modifiers:{offset:offsetConf,flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return popperConfig;};Dropdown._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=typeof config==='object'?config:null;if(!data){data=new Dropdown(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};Dropdown._clearMenus=function _clearMenus(event){if(event&&(event.which===RIGHT_MOUSE_BUTTON_WHICH||event.type==='keyup'&&event.which!==TAB_KEYCODE)){return;}
var toggles=$$$1.makeArray($$$1(Selector.DATA_TOGGLE));for(var i=0;i<toggles.length;i++){var parent=Dropdown._getParentFromElement(toggles[i]);var context=$$$1(toggles[i]).data(DATA_KEY);var relatedTarget={relatedTarget:toggles[i]};if(!context){continue;}
var dropdownMenu=context._menu;if(!$$$1(parent).hasClass(ClassName.SHOW)){continue;}
if(event&&(event.type==='click'&&/input|textarea/i.test(event.target.tagName)||event.type==='keyup'&&event.which===TAB_KEYCODE)&&$$$1.contains(parent,event.target)){continue;}
var hideEvent=$$$1.Event(Event.HIDE,relatedTarget);$$$1(parent).trigger(hideEvent);if(hideEvent.isDefaultPrevented()){continue;}
if('ontouchstart'in document.documentElement){$$$1('body').children().off('mouseover',null,$$$1.noop);}
toggles[i].setAttribute('aria-expanded','false');$$$1(dropdownMenu).removeClass(ClassName.SHOW);$$$1(parent).removeClass(ClassName.SHOW).trigger($$$1.Event(Event.HIDDEN,relatedTarget));}};Dropdown._getParentFromElement=function _getParentFromElement(element){var parent;var selector=Util.getSelectorFromElement(element);if(selector){parent=$$$1(selector)[0];}
return parent||element.parentNode;};Dropdown._dataApiKeydownHandler=function _dataApiKeydownHandler(event){if(/input|textarea/i.test(event.target.tagName)?event.which===SPACE_KEYCODE||event.which!==ESCAPE_KEYCODE&&(event.which!==ARROW_DOWN_KEYCODE&&event.which!==ARROW_UP_KEYCODE||$$$1(event.target).closest(Selector.MENU).length):!REGEXP_KEYDOWN.test(event.which)){return;}
event.preventDefault();event.stopPropagation();if(this.disabled||$$$1(this).hasClass(ClassName.DISABLED)){return;}
var parent=Dropdown._getParentFromElement(this);var isActive=$$$1(parent).hasClass(ClassName.SHOW);if(!isActive&&(event.which!==ESCAPE_KEYCODE||event.which!==SPACE_KEYCODE)||isActive&&(event.which===ESCAPE_KEYCODE||event.which===SPACE_KEYCODE)){if(event.which===ESCAPE_KEYCODE){var toggle=$$$1(parent).find(Selector.DATA_TOGGLE)[0];$$$1(toggle).trigger('focus');}
$$$1(this).trigger('click');return;}
var items=$$$1(parent).find(Selector.VISIBLE_ITEMS).get();if(items.length===0){return;}
var index=items.indexOf(event.target);if(event.which===ARROW_UP_KEYCODE&&index>0){index--;}
if(event.which===ARROW_DOWN_KEYCODE&&index<items.length-1){index++;}
if(index<0){index=0;}
items[index].focus();};_createClass(Dropdown,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}},{key:"DefaultType",get:function get(){return DefaultType;}}]);return Dropdown;}();$$$1(document).on(Event.KEYDOWN_DATA_API,Selector.DATA_TOGGLE,Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API,Selector.MENU,Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API+" "+Event.KEYUP_DATA_API,Dropdown._clearMenus).on(Event.CLICK_DATA_API,Selector.DATA_TOGGLE,function(event){event.preventDefault();event.stopPropagation();Dropdown._jQueryInterface.call($$$1(this),'toggle');}).on(Event.CLICK_DATA_API,Selector.FORM_CHILD,function(e){e.stopPropagation();});$$$1.fn[NAME]=Dropdown._jQueryInterface;$$$1.fn[NAME].Constructor=Dropdown;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Dropdown._jQueryInterface;};return Dropdown;}($,Popper);var Modal=function($$$1){var NAME='modal';var VERSION='4.0.0';var DATA_KEY='bs.modal';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=300;var BACKDROP_TRANSITION_DURATION=150;var ESCAPE_KEYCODE=27;var Default={backdrop:true,keyboard:true,focus:true,show:true};var DefaultType={backdrop:'(boolean|string)',keyboard:'boolean',focus:'boolean',show:'boolean'};var Event={HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,FOCUSIN:"focusin"+EVENT_KEY,RESIZE:"resize"+EVENT_KEY,CLICK_DISMISS:"click.dismiss"+EVENT_KEY,KEYDOWN_DISMISS:"keydown.dismiss"+EVENT_KEY,MOUSEUP_DISMISS:"mouseup.dismiss"+EVENT_KEY,MOUSEDOWN_DISMISS:"mousedown.dismiss"+EVENT_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY};var ClassName={SCROLLBAR_MEASURER:'modal-scrollbar-measure',BACKDROP:'modal-backdrop',OPEN:'modal-open',FADE:'fade',SHOW:'show'};var Selector={DIALOG:'.modal-dialog',DATA_TOGGLE:'[data-toggle="modal"]',DATA_DISMISS:'[data-dismiss="modal"]',FIXED_CONTENT:'.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',STICKY_CONTENT:'.sticky-top',NAVBAR_TOGGLER:'.navbar-toggler'};var Modal=function(){function Modal(element,config){this._config=this._getConfig(config);this._element=element;this._dialog=$$$1(element).find(Selector.DIALOG)[0];this._backdrop=null;this._isShown=false;this._isBodyOverflowing=false;this._ignoreBackdropClick=false;this._originalBodyPadding=0;this._scrollbarWidth=0;}
var _proto=Modal.prototype;_proto.toggle=function toggle(relatedTarget){return this._isShown?this.hide():this.show(relatedTarget);};_proto.show=function show(relatedTarget){var _this=this;if(this._isTransitioning||this._isShown){return;}
if(Util.supportsTransitionEnd()&&$$$1(this._element).hasClass(ClassName.FADE)){this._isTransitioning=true;}
var showEvent=$$$1.Event(Event.SHOW,{relatedTarget:relatedTarget});$$$1(this._element).trigger(showEvent);if(this._isShown||showEvent.isDefaultPrevented()){return;}
this._isShown=true;this._checkScrollbar();this._setScrollbar();this._adjustDialog();$$$1(document.body).addClass(ClassName.OPEN);this._setEscapeEvent();this._setResizeEvent();$$$1(this._element).on(Event.CLICK_DISMISS,Selector.DATA_DISMISS,function(event){return _this.hide(event);});$$$1(this._dialog).on(Event.MOUSEDOWN_DISMISS,function(){$$$1(_this._element).one(Event.MOUSEUP_DISMISS,function(event){if($$$1(event.target).is(_this._element)){_this._ignoreBackdropClick=true;}});});this._showBackdrop(function(){return _this._showElement(relatedTarget);});};_proto.hide=function hide(event){var _this2=this;if(event){event.preventDefault();}
if(this._isTransitioning||!this._isShown){return;}
var hideEvent=$$$1.Event(Event.HIDE);$$$1(this._element).trigger(hideEvent);if(!this._isShown||hideEvent.isDefaultPrevented()){return;}
this._isShown=false;var transition=Util.supportsTransitionEnd()&&$$$1(this._element).hasClass(ClassName.FADE);if(transition){this._isTransitioning=true;}
this._setEscapeEvent();this._setResizeEvent();$$$1(document).off(Event.FOCUSIN);$$$1(this._element).removeClass(ClassName.SHOW);$$$1(this._element).off(Event.CLICK_DISMISS);$$$1(this._dialog).off(Event.MOUSEDOWN_DISMISS);if(transition){$$$1(this._element).one(Util.TRANSITION_END,function(event){return _this2._hideModal(event);}).emulateTransitionEnd(TRANSITION_DURATION);}else{this._hideModal();}};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);$$$1(window,document,this._element,this._backdrop).off(EVENT_KEY);this._config=null;this._element=null;this._dialog=null;this._backdrop=null;this._isShown=null;this._isBodyOverflowing=null;this._ignoreBackdropClick=null;this._scrollbarWidth=null;};_proto.handleUpdate=function handleUpdate(){this._adjustDialog();};_proto._getConfig=function _getConfig(config){config=_extends({},Default,config);Util.typeCheckConfig(NAME,config,DefaultType);return config;};_proto._showElement=function _showElement(relatedTarget){var _this3=this;var transition=Util.supportsTransitionEnd()&&$$$1(this._element).hasClass(ClassName.FADE);if(!this._element.parentNode||this._element.parentNode.nodeType!==Node.ELEMENT_NODE){document.body.appendChild(this._element);}
this._element.style.display='block';this._element.removeAttribute('aria-hidden');this._element.scrollTop=0;if(transition){Util.reflow(this._element);}
$$$1(this._element).addClass(ClassName.SHOW);if(this._config.focus){this._enforceFocus();}
var shownEvent=$$$1.Event(Event.SHOWN,{relatedTarget:relatedTarget});var transitionComplete=function transitionComplete(){if(_this3._config.focus){_this3._element.focus();}
_this3._isTransitioning=false;$$$1(_this3._element).trigger(shownEvent);};if(transition){$$$1(this._dialog).one(Util.TRANSITION_END,transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);}else{transitionComplete();}};_proto._enforceFocus=function _enforceFocus(){var _this4=this;$$$1(document).off(Event.FOCUSIN).on(Event.FOCUSIN,function(event){if(document!==event.target&&_this4._element!==event.target&&$$$1(_this4._element).has(event.target).length===0){_this4._element.focus();}});};_proto._setEscapeEvent=function _setEscapeEvent(){var _this5=this;if(this._isShown&&this._config.keyboard){$$$1(this._element).on(Event.KEYDOWN_DISMISS,function(event){if(event.which===ESCAPE_KEYCODE){event.preventDefault();_this5.hide();}});}else if(!this._isShown){$$$1(this._element).off(Event.KEYDOWN_DISMISS);}};_proto._setResizeEvent=function _setResizeEvent(){var _this6=this;if(this._isShown){$$$1(window).on(Event.RESIZE,function(event){return _this6.handleUpdate(event);});}else{$$$1(window).off(Event.RESIZE);}};_proto._hideModal=function _hideModal(){var _this7=this;this._element.style.display='none';this._element.setAttribute('aria-hidden',true);this._isTransitioning=false;this._showBackdrop(function(){$$$1(document.body).removeClass(ClassName.OPEN);_this7._resetAdjustments();_this7._resetScrollbar();$$$1(_this7._element).trigger(Event.HIDDEN);});};_proto._removeBackdrop=function _removeBackdrop(){if(this._backdrop){$$$1(this._backdrop).remove();this._backdrop=null;}};_proto._showBackdrop=function _showBackdrop(callback){var _this8=this;var animate=$$$1(this._element).hasClass(ClassName.FADE)?ClassName.FADE:'';if(this._isShown&&this._config.backdrop){var doAnimate=Util.supportsTransitionEnd()&&animate;this._backdrop=document.createElement('div');this._backdrop.className=ClassName.BACKDROP;if(animate){$$$1(this._backdrop).addClass(animate);}
$$$1(this._backdrop).appendTo(document.body);$$$1(this._element).on(Event.CLICK_DISMISS,function(event){if(_this8._ignoreBackdropClick){_this8._ignoreBackdropClick=false;return;}
if(event.target!==event.currentTarget){return;}
if(_this8._config.backdrop==='static'){_this8._element.focus();}else{_this8.hide();}});if(doAnimate){Util.reflow(this._backdrop);}
$$$1(this._backdrop).addClass(ClassName.SHOW);if(!callback){return;}
if(!doAnimate){callback();return;}
$$$1(this._backdrop).one(Util.TRANSITION_END,callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);}else if(!this._isShown&&this._backdrop){$$$1(this._backdrop).removeClass(ClassName.SHOW);var callbackRemove=function callbackRemove(){_this8._removeBackdrop();if(callback){callback();}};if(Util.supportsTransitionEnd()&&$$$1(this._element).hasClass(ClassName.FADE)){$$$1(this._backdrop).one(Util.TRANSITION_END,callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);}else{callbackRemove();}}else if(callback){callback();}};_proto._adjustDialog=function _adjustDialog(){var isModalOverflowing=this._element.scrollHeight>document.documentElement.clientHeight;if(!this._isBodyOverflowing&&isModalOverflowing){this._element.style.paddingLeft=this._scrollbarWidth+"px";}
if(this._isBodyOverflowing&&!isModalOverflowing){this._element.style.paddingRight=this._scrollbarWidth+"px";}};_proto._resetAdjustments=function _resetAdjustments(){this._element.style.paddingLeft='';this._element.style.paddingRight='';};_proto._checkScrollbar=function _checkScrollbar(){var rect=document.body.getBoundingClientRect();this._isBodyOverflowing=rect.left+rect.right<window.innerWidth;this._scrollbarWidth=this._getScrollbarWidth();};_proto._setScrollbar=function _setScrollbar(){var _this9=this;if(this._isBodyOverflowing){$$$1(Selector.FIXED_CONTENT).each(function(index,element){var actualPadding=$$$1(element)[0].style.paddingRight;var calculatedPadding=$$$1(element).css('padding-right');$$$1(element).data('padding-right',actualPadding).css('padding-right',parseFloat(calculatedPadding)+_this9._scrollbarWidth+"px");});$$$1(Selector.STICKY_CONTENT).each(function(index,element){var actualMargin=$$$1(element)[0].style.marginRight;var calculatedMargin=$$$1(element).css('margin-right');$$$1(element).data('margin-right',actualMargin).css('margin-right',parseFloat(calculatedMargin)-_this9._scrollbarWidth+"px");});$$$1(Selector.NAVBAR_TOGGLER).each(function(index,element){var actualMargin=$$$1(element)[0].style.marginRight;var calculatedMargin=$$$1(element).css('margin-right');$$$1(element).data('margin-right',actualMargin).css('margin-right',parseFloat(calculatedMargin)+_this9._scrollbarWidth+"px");});var actualPadding=document.body.style.paddingRight;var calculatedPadding=$$$1('body').css('padding-right');$$$1('body').data('padding-right',actualPadding).css('padding-right',parseFloat(calculatedPadding)+this._scrollbarWidth+"px");}};_proto._resetScrollbar=function _resetScrollbar(){$$$1(Selector.FIXED_CONTENT).each(function(index,element){var padding=$$$1(element).data('padding-right');if(typeof padding!=='undefined'){$$$1(element).css('padding-right',padding).removeData('padding-right');}});$$$1(Selector.STICKY_CONTENT+", "+Selector.NAVBAR_TOGGLER).each(function(index,element){var margin=$$$1(element).data('margin-right');if(typeof margin!=='undefined'){$$$1(element).css('margin-right',margin).removeData('margin-right');}});var padding=$$$1('body').data('padding-right');if(typeof padding!=='undefined'){$$$1('body').css('padding-right',padding).removeData('padding-right');}};_proto._getScrollbarWidth=function _getScrollbarWidth(){var scrollDiv=document.createElement('div');scrollDiv.className=ClassName.SCROLLBAR_MEASURER;document.body.appendChild(scrollDiv);var scrollbarWidth=scrollDiv.getBoundingClientRect().width-scrollDiv.clientWidth;document.body.removeChild(scrollDiv);return scrollbarWidth;};Modal._jQueryInterface=function _jQueryInterface(config,relatedTarget){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=_extends({},Modal.Default,$$$1(this).data(),typeof config==='object'&&config);if(!data){data=new Modal(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config](relatedTarget);}else if(_config.show){data.show(relatedTarget);}});};_createClass(Modal,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}}]);return Modal;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DATA_TOGGLE,function(event){var _this10=this;var target;var selector=Util.getSelectorFromElement(this);if(selector){target=$$$1(selector)[0];}
var config=$$$1(target).data(DATA_KEY)?'toggle':_extends({},$$$1(target).data(),$$$1(this).data());if(this.tagName==='A'||this.tagName==='AREA'){event.preventDefault();}
var $target=$$$1(target).one(Event.SHOW,function(showEvent){if(showEvent.isDefaultPrevented()){return;}
$target.one(Event.HIDDEN,function(){if($$$1(_this10).is(':visible')){_this10.focus();}});});Modal._jQueryInterface.call($$$1(target),config,this);});$$$1.fn[NAME]=Modal._jQueryInterface;$$$1.fn[NAME].Constructor=Modal;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Modal._jQueryInterface;};return Modal;}($);var Tooltip=function($$$1){var NAME='tooltip';var VERSION='4.0.0';var DATA_KEY='bs.tooltip';var EVENT_KEY="."+DATA_KEY;var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=150;var CLASS_PREFIX='bs-tooltip';var BSCLS_PREFIX_REGEX=new RegExp("(^|\\s)"+CLASS_PREFIX+"\\S+",'g');var DefaultType={animation:'boolean',template:'string',title:'(string|element|function)',trigger:'string',delay:'(number|object)',html:'boolean',selector:'(string|boolean)',placement:'(string|function)',offset:'(number|string)',container:'(string|element|boolean)',fallbackPlacement:'(string|array)',boundary:'(string|element)'};var AttachmentMap={AUTO:'auto',TOP:'top',RIGHT:'right',BOTTOM:'bottom',LEFT:'left'};var Default={animation:true,template:'<div class="tooltip" role="tooltip">'+'<div class="arrow"></div>'+'<div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,selector:false,placement:'top',offset:0,container:false,fallbackPlacement:'flip',boundary:'scrollParent'};var HoverState={SHOW:'show',OUT:'out'};var Event={HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,INSERTED:"inserted"+EVENT_KEY,CLICK:"click"+EVENT_KEY,FOCUSIN:"focusin"+EVENT_KEY,FOCUSOUT:"focusout"+EVENT_KEY,MOUSEENTER:"mouseenter"+EVENT_KEY,MOUSELEAVE:"mouseleave"+EVENT_KEY};var ClassName={FADE:'fade',SHOW:'show'};var Selector={TOOLTIP:'.tooltip',TOOLTIP_INNER:'.tooltip-inner',ARROW:'.arrow'};var Trigger={HOVER:'hover',FOCUS:'focus',CLICK:'click',MANUAL:'manual'};var Tooltip=function(){function Tooltip(element,config){if(typeof Popper==='undefined'){throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)');}
this._isEnabled=true;this._timeout=0;this._hoverState='';this._activeTrigger={};this._popper=null;this.element=element;this.config=this._getConfig(config);this.tip=null;this._setListeners();}
var _proto=Tooltip.prototype;_proto.enable=function enable(){this._isEnabled=true;};_proto.disable=function disable(){this._isEnabled=false;};_proto.toggleEnabled=function toggleEnabled(){this._isEnabled=!this._isEnabled;};_proto.toggle=function toggle(event){if(!this._isEnabled){return;}
if(event){var dataKey=this.constructor.DATA_KEY;var context=$$$1(event.currentTarget).data(dataKey);if(!context){context=new this.constructor(event.currentTarget,this._getDelegateConfig());$$$1(event.currentTarget).data(dataKey,context);}
context._activeTrigger.click=!context._activeTrigger.click;if(context._isWithActiveTrigger()){context._enter(null,context);}else{context._leave(null,context);}}else{if($$$1(this.getTipElement()).hasClass(ClassName.SHOW)){this._leave(null,this);return;}
this._enter(null,this);}};_proto.dispose=function dispose(){clearTimeout(this._timeout);$$$1.removeData(this.element,this.constructor.DATA_KEY);$$$1(this.element).off(this.constructor.EVENT_KEY);$$$1(this.element).closest('.modal').off('hide.bs.modal');if(this.tip){$$$1(this.tip).remove();}
this._isEnabled=null;this._timeout=null;this._hoverState=null;this._activeTrigger=null;if(this._popper!==null){this._popper.destroy();}
this._popper=null;this.element=null;this.config=null;this.tip=null;};_proto.show=function show(){var _this=this;if($$$1(this.element).css('display')==='none'){throw new Error('Please use show on visible elements');}
var showEvent=$$$1.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){$$$1(this.element).trigger(showEvent);var isInTheDom=$$$1.contains(this.element.ownerDocument.documentElement,this.element);if(showEvent.isDefaultPrevented()||!isInTheDom){return;}
var tip=this.getTipElement();var tipId=Util.getUID(this.constructor.NAME);tip.setAttribute('id',tipId);this.element.setAttribute('aria-describedby',tipId);this.setContent();if(this.config.animation){$$$1(tip).addClass(ClassName.FADE);}
var placement=typeof this.config.placement==='function'?this.config.placement.call(this,tip,this.element):this.config.placement;var attachment=this._getAttachment(placement);this.addAttachmentClass(attachment);var container=this.config.container===false?document.body:$$$1(this.config.container);$$$1(tip).data(this.constructor.DATA_KEY,this);if(!$$$1.contains(this.element.ownerDocument.documentElement,this.tip)){$$$1(tip).appendTo(container);}
$$$1(this.element).trigger(this.constructor.Event.INSERTED);this._popper=new Popper(this.element,tip,{placement:attachment,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:Selector.ARROW},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function onCreate(data){if(data.originalPlacement!==data.placement){_this._handlePopperPlacementChange(data);}},onUpdate:function onUpdate(data){_this._handlePopperPlacementChange(data);}});$$$1(tip).addClass(ClassName.SHOW);if('ontouchstart'in document.documentElement){$$$1('body').children().on('mouseover',null,$$$1.noop);}
var complete=function complete(){if(_this.config.animation){_this._fixTransition();}
var prevHoverState=_this._hoverState;_this._hoverState=null;$$$1(_this.element).trigger(_this.constructor.Event.SHOWN);if(prevHoverState===HoverState.OUT){_this._leave(null,_this);}};if(Util.supportsTransitionEnd()&&$$$1(this.tip).hasClass(ClassName.FADE)){$$$1(this.tip).one(Util.TRANSITION_END,complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);}else{complete();}}};_proto.hide=function hide(callback){var _this2=this;var tip=this.getTipElement();var hideEvent=$$$1.Event(this.constructor.Event.HIDE);var complete=function complete(){if(_this2._hoverState!==HoverState.SHOW&&tip.parentNode){tip.parentNode.removeChild(tip);}
_this2._cleanTipClass();_this2.element.removeAttribute('aria-describedby');$$$1(_this2.element).trigger(_this2.constructor.Event.HIDDEN);if(_this2._popper!==null){_this2._popper.destroy();}
if(callback){callback();}};$$$1(this.element).trigger(hideEvent);if(hideEvent.isDefaultPrevented()){return;}
$$$1(tip).removeClass(ClassName.SHOW);if('ontouchstart'in document.documentElement){$$$1('body').children().off('mouseover',null,$$$1.noop);}
this._activeTrigger[Trigger.CLICK]=false;this._activeTrigger[Trigger.FOCUS]=false;this._activeTrigger[Trigger.HOVER]=false;if(Util.supportsTransitionEnd()&&$$$1(this.tip).hasClass(ClassName.FADE)){$$$1(tip).one(Util.TRANSITION_END,complete).emulateTransitionEnd(TRANSITION_DURATION);}else{complete();}
this._hoverState='';};_proto.update=function update(){if(this._popper!==null){this._popper.scheduleUpdate();}};_proto.isWithContent=function isWithContent(){return Boolean(this.getTitle());};_proto.addAttachmentClass=function addAttachmentClass(attachment){$$$1(this.getTipElement()).addClass(CLASS_PREFIX+"-"+attachment);};_proto.getTipElement=function getTipElement(){this.tip=this.tip||$$$1(this.config.template)[0];return this.tip;};_proto.setContent=function setContent(){var $tip=$$$1(this.getTipElement());this.setElementContent($tip.find(Selector.TOOLTIP_INNER),this.getTitle());$tip.removeClass(ClassName.FADE+" "+ClassName.SHOW);};_proto.setElementContent=function setElementContent($element,content){var html=this.config.html;if(typeof content==='object'&&(content.nodeType||content.jquery)){if(html){if(!$$$1(content).parent().is($element)){$element.empty().append(content);}}else{$element.text($$$1(content).text());}}else{$element[html?'html':'text'](content);}};_proto.getTitle=function getTitle(){var title=this.element.getAttribute('data-original-title');if(!title){title=typeof this.config.title==='function'?this.config.title.call(this.element):this.config.title;}
return title;};_proto._getAttachment=function _getAttachment(placement){return AttachmentMap[placement.toUpperCase()];};_proto._setListeners=function _setListeners(){var _this3=this;var triggers=this.config.trigger.split(' ');triggers.forEach(function(trigger){if(trigger==='click'){$$$1(_this3.element).on(_this3.constructor.Event.CLICK,_this3.config.selector,function(event){return _this3.toggle(event);});}else if(trigger!==Trigger.MANUAL){var eventIn=trigger===Trigger.HOVER?_this3.constructor.Event.MOUSEENTER:_this3.constructor.Event.FOCUSIN;var eventOut=trigger===Trigger.HOVER?_this3.constructor.Event.MOUSELEAVE:_this3.constructor.Event.FOCUSOUT;$$$1(_this3.element).on(eventIn,_this3.config.selector,function(event){return _this3._enter(event);}).on(eventOut,_this3.config.selector,function(event){return _this3._leave(event);});}
$$$1(_this3.element).closest('.modal').on('hide.bs.modal',function(){return _this3.hide();});});if(this.config.selector){this.config=_extends({},this.config,{trigger:'manual',selector:''});}else{this._fixTitle();}};_proto._fixTitle=function _fixTitle(){var titleType=typeof this.element.getAttribute('data-original-title');if(this.element.getAttribute('title')||titleType!=='string'){this.element.setAttribute('data-original-title',this.element.getAttribute('title')||'');this.element.setAttribute('title','');}};_proto._enter=function _enter(event,context){var dataKey=this.constructor.DATA_KEY;context=context||$$$1(event.currentTarget).data(dataKey);if(!context){context=new this.constructor(event.currentTarget,this._getDelegateConfig());$$$1(event.currentTarget).data(dataKey,context);}
if(event){context._activeTrigger[event.type==='focusin'?Trigger.FOCUS:Trigger.HOVER]=true;}
if($$$1(context.getTipElement()).hasClass(ClassName.SHOW)||context._hoverState===HoverState.SHOW){context._hoverState=HoverState.SHOW;return;}
clearTimeout(context._timeout);context._hoverState=HoverState.SHOW;if(!context.config.delay||!context.config.delay.show){context.show();return;}
context._timeout=setTimeout(function(){if(context._hoverState===HoverState.SHOW){context.show();}},context.config.delay.show);};_proto._leave=function _leave(event,context){var dataKey=this.constructor.DATA_KEY;context=context||$$$1(event.currentTarget).data(dataKey);if(!context){context=new this.constructor(event.currentTarget,this._getDelegateConfig());$$$1(event.currentTarget).data(dataKey,context);}
if(event){context._activeTrigger[event.type==='focusout'?Trigger.FOCUS:Trigger.HOVER]=false;}
if(context._isWithActiveTrigger()){return;}
clearTimeout(context._timeout);context._hoverState=HoverState.OUT;if(!context.config.delay||!context.config.delay.hide){context.hide();return;}
context._timeout=setTimeout(function(){if(context._hoverState===HoverState.OUT){context.hide();}},context.config.delay.hide);};_proto._isWithActiveTrigger=function _isWithActiveTrigger(){for(var trigger in this._activeTrigger){if(this._activeTrigger[trigger]){return true;}}
return false;};_proto._getConfig=function _getConfig(config){config=_extends({},this.constructor.Default,$$$1(this.element).data(),config);if(typeof config.delay==='number'){config.delay={show:config.delay,hide:config.delay};}
if(typeof config.title==='number'){config.title=config.title.toString();}
if(typeof config.content==='number'){config.content=config.content.toString();}
Util.typeCheckConfig(NAME,config,this.constructor.DefaultType);return config;};_proto._getDelegateConfig=function _getDelegateConfig(){var config={};if(this.config){for(var key in this.config){if(this.constructor.Default[key]!==this.config[key]){config[key]=this.config[key];}}}
return config;};_proto._cleanTipClass=function _cleanTipClass(){var $tip=$$$1(this.getTipElement());var tabClass=$tip.attr('class').match(BSCLS_PREFIX_REGEX);if(tabClass!==null&&tabClass.length>0){$tip.removeClass(tabClass.join(''));}};_proto._handlePopperPlacementChange=function _handlePopperPlacementChange(data){this._cleanTipClass();this.addAttachmentClass(this._getAttachment(data.placement));};_proto._fixTransition=function _fixTransition(){var tip=this.getTipElement();var initConfigAnimation=this.config.animation;if(tip.getAttribute('x-placement')!==null){return;}
$$$1(tip).removeClass(ClassName.FADE);this.config.animation=false;this.hide();this.show();this.config.animation=initConfigAnimation;};Tooltip._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=typeof config==='object'&&config;if(!data&&/dispose|hide/.test(config)){return;}
if(!data){data=new Tooltip(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};_createClass(Tooltip,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}},{key:"NAME",get:function get(){return NAME;}},{key:"DATA_KEY",get:function get(){return DATA_KEY;}},{key:"Event",get:function get(){return Event;}},{key:"EVENT_KEY",get:function get(){return EVENT_KEY;}},{key:"DefaultType",get:function get(){return DefaultType;}}]);return Tooltip;}();$$$1.fn[NAME]=Tooltip._jQueryInterface;$$$1.fn[NAME].Constructor=Tooltip;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Tooltip._jQueryInterface;};return Tooltip;}($,Popper);var Popover=function($$$1){var NAME='popover';var VERSION='4.0.0';var DATA_KEY='bs.popover';var EVENT_KEY="."+DATA_KEY;var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var CLASS_PREFIX='bs-popover';var BSCLS_PREFIX_REGEX=new RegExp("(^|\\s)"+CLASS_PREFIX+"\\S+",'g');var Default=_extends({},Tooltip.Default,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip">'+'<div class="arrow"></div>'+'<h3 class="popover-header"></h3>'+'<div class="popover-body"></div></div>'});var DefaultType=_extends({},Tooltip.DefaultType,{content:'(string|element|function)'});var ClassName={FADE:'fade',SHOW:'show'};var Selector={TITLE:'.popover-header',CONTENT:'.popover-body'};var Event={HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,INSERTED:"inserted"+EVENT_KEY,CLICK:"click"+EVENT_KEY,FOCUSIN:"focusin"+EVENT_KEY,FOCUSOUT:"focusout"+EVENT_KEY,MOUSEENTER:"mouseenter"+EVENT_KEY,MOUSELEAVE:"mouseleave"+EVENT_KEY};var Popover=function(_Tooltip){_inheritsLoose(Popover,_Tooltip);function Popover(){return _Tooltip.apply(this,arguments)||this;}
var _proto=Popover.prototype;_proto.isWithContent=function isWithContent(){return this.getTitle()||this._getContent();};_proto.addAttachmentClass=function addAttachmentClass(attachment){$$$1(this.getTipElement()).addClass(CLASS_PREFIX+"-"+attachment);};_proto.getTipElement=function getTipElement(){this.tip=this.tip||$$$1(this.config.template)[0];return this.tip;};_proto.setContent=function setContent(){var $tip=$$$1(this.getTipElement());this.setElementContent($tip.find(Selector.TITLE),this.getTitle());var content=this._getContent();if(typeof content==='function'){content=content.call(this.element);}
this.setElementContent($tip.find(Selector.CONTENT),content);$tip.removeClass(ClassName.FADE+" "+ClassName.SHOW);};_proto._getContent=function _getContent(){return this.element.getAttribute('data-content')||this.config.content;};_proto._cleanTipClass=function _cleanTipClass(){var $tip=$$$1(this.getTipElement());var tabClass=$tip.attr('class').match(BSCLS_PREFIX_REGEX);if(tabClass!==null&&tabClass.length>0){$tip.removeClass(tabClass.join(''));}};Popover._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=typeof config==='object'?config:null;if(!data&&/destroy|hide/.test(config)){return;}
if(!data){data=new Popover(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};_createClass(Popover,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}},{key:"NAME",get:function get(){return NAME;}},{key:"DATA_KEY",get:function get(){return DATA_KEY;}},{key:"Event",get:function get(){return Event;}},{key:"EVENT_KEY",get:function get(){return EVENT_KEY;}},{key:"DefaultType",get:function get(){return DefaultType;}}]);return Popover;}(Tooltip);$$$1.fn[NAME]=Popover._jQueryInterface;$$$1.fn[NAME].Constructor=Popover;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Popover._jQueryInterface;};return Popover;}($);var ScrollSpy=function($$$1){var NAME='scrollspy';var VERSION='4.0.0';var DATA_KEY='bs.scrollspy';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var Default={offset:10,method:'auto',target:''};var DefaultType={offset:'number',method:'string',target:'(string|element)'};var Event={ACTIVATE:"activate"+EVENT_KEY,SCROLL:"scroll"+EVENT_KEY,LOAD_DATA_API:"load"+EVENT_KEY+DATA_API_KEY};var ClassName={DROPDOWN_ITEM:'dropdown-item',DROPDOWN_MENU:'dropdown-menu',ACTIVE:'active'};var Selector={DATA_SPY:'[data-spy="scroll"]',ACTIVE:'.active',NAV_LIST_GROUP:'.nav, .list-group',NAV_LINKS:'.nav-link',NAV_ITEMS:'.nav-item',LIST_ITEMS:'.list-group-item',DROPDOWN:'.dropdown',DROPDOWN_ITEMS:'.dropdown-item',DROPDOWN_TOGGLE:'.dropdown-toggle'};var OffsetMethod={OFFSET:'offset',POSITION:'position'};var ScrollSpy=function(){function ScrollSpy(element,config){var _this=this;this._element=element;this._scrollElement=element.tagName==='BODY'?window:element;this._config=this._getConfig(config);this._selector=this._config.target+" "+Selector.NAV_LINKS+","+(this._config.target+" "+Selector.LIST_ITEMS+",")+(this._config.target+" "+Selector.DROPDOWN_ITEMS);this._offsets=[];this._targets=[];this._activeTarget=null;this._scrollHeight=0;$$$1(this._scrollElement).on(Event.SCROLL,function(event){return _this._process(event);});this.refresh();this._process();}
var _proto=ScrollSpy.prototype;_proto.refresh=function refresh(){var _this2=this;var autoMethod=this._scrollElement===this._scrollElement.window?OffsetMethod.OFFSET:OffsetMethod.POSITION;var offsetMethod=this._config.method==='auto'?autoMethod:this._config.method;var offsetBase=offsetMethod===OffsetMethod.POSITION?this._getScrollTop():0;this._offsets=[];this._targets=[];this._scrollHeight=this._getScrollHeight();var targets=$$$1.makeArray($$$1(this._selector));targets.map(function(element){var target;var targetSelector=Util.getSelectorFromElement(element);if(targetSelector){target=$$$1(targetSelector)[0];}
if(target){var targetBCR=target.getBoundingClientRect();if(targetBCR.width||targetBCR.height){return[$$$1(target)[offsetMethod]().top+offsetBase,targetSelector];}}
return null;}).filter(function(item){return item;}).sort(function(a,b){return a[0]-b[0];}).forEach(function(item){_this2._offsets.push(item[0]);_this2._targets.push(item[1]);});};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);$$$1(this._scrollElement).off(EVENT_KEY);this._element=null;this._scrollElement=null;this._config=null;this._selector=null;this._offsets=null;this._targets=null;this._activeTarget=null;this._scrollHeight=null;};_proto._getConfig=function _getConfig(config){config=_extends({},Default,config);if(typeof config.target!=='string'){var id=$$$1(config.target).attr('id');if(!id){id=Util.getUID(NAME);$$$1(config.target).attr('id',id);}
config.target="#"+id;}
Util.typeCheckConfig(NAME,config,DefaultType);return config;};_proto._getScrollTop=function _getScrollTop(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop;};_proto._getScrollHeight=function _getScrollHeight(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);};_proto._getOffsetHeight=function _getOffsetHeight(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height;};_proto._process=function _process(){var scrollTop=this._getScrollTop()+this._config.offset;var scrollHeight=this._getScrollHeight();var maxScroll=this._config.offset+scrollHeight-this._getOffsetHeight();if(this._scrollHeight!==scrollHeight){this.refresh();}
if(scrollTop>=maxScroll){var target=this._targets[this._targets.length-1];if(this._activeTarget!==target){this._activate(target);}
return;}
if(this._activeTarget&&scrollTop<this._offsets[0]&&this._offsets[0]>0){this._activeTarget=null;this._clear();return;}
for(var i=this._offsets.length;i--;){var isActiveTarget=this._activeTarget!==this._targets[i]&&scrollTop>=this._offsets[i]&&(typeof this._offsets[i+1]==='undefined'||scrollTop<this._offsets[i+1]);if(isActiveTarget){this._activate(this._targets[i]);}}};_proto._activate=function _activate(target){this._activeTarget=target;this._clear();var queries=this._selector.split(',');queries=queries.map(function(selector){return selector+"[data-target=\""+target+"\"],"+(selector+"[href=\""+target+"\"]");});var $link=$$$1(queries.join(','));if($link.hasClass(ClassName.DROPDOWN_ITEM)){$link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);$link.addClass(ClassName.ACTIVE);}else{$link.addClass(ClassName.ACTIVE);$link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS+", "+Selector.LIST_ITEMS).addClass(ClassName.ACTIVE);$link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);}
$$$1(this._scrollElement).trigger(Event.ACTIVATE,{relatedTarget:target});};_proto._clear=function _clear(){$$$1(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);};ScrollSpy._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var data=$$$1(this).data(DATA_KEY);var _config=typeof config==='object'&&config;if(!data){data=new ScrollSpy(this,_config);$$$1(this).data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};_createClass(ScrollSpy,null,[{key:"VERSION",get:function get(){return VERSION;}},{key:"Default",get:function get(){return Default;}}]);return ScrollSpy;}();$$$1(window).on(Event.LOAD_DATA_API,function(){var scrollSpys=$$$1.makeArray($$$1(Selector.DATA_SPY));for(var i=scrollSpys.length;i--;){var $spy=$$$1(scrollSpys[i]);ScrollSpy._jQueryInterface.call($spy,$spy.data());}});$$$1.fn[NAME]=ScrollSpy._jQueryInterface;$$$1.fn[NAME].Constructor=ScrollSpy;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return ScrollSpy._jQueryInterface;};return ScrollSpy;}($);var Tab=function($$$1){var NAME='tab';var VERSION='4.0.0';var DATA_KEY='bs.tab';var EVENT_KEY="."+DATA_KEY;var DATA_API_KEY='.data-api';var JQUERY_NO_CONFLICT=$$$1.fn[NAME];var TRANSITION_DURATION=150;var Event={HIDE:"hide"+EVENT_KEY,HIDDEN:"hidden"+EVENT_KEY,SHOW:"show"+EVENT_KEY,SHOWN:"shown"+EVENT_KEY,CLICK_DATA_API:"click"+EVENT_KEY+DATA_API_KEY};var ClassName={DROPDOWN_MENU:'dropdown-menu',ACTIVE:'active',DISABLED:'disabled',FADE:'fade',SHOW:'show'};var Selector={DROPDOWN:'.dropdown',NAV_LIST_GROUP:'.nav, .list-group',ACTIVE:'.active',ACTIVE_UL:'> li > .active',DATA_TOGGLE:'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',DROPDOWN_TOGGLE:'.dropdown-toggle',DROPDOWN_ACTIVE_CHILD:'> .dropdown-menu .active'};var Tab=function(){function Tab(element){this._element=element;}
var _proto=Tab.prototype;_proto.show=function show(){var _this=this;if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&$$$1(this._element).hasClass(ClassName.ACTIVE)||$$$1(this._element).hasClass(ClassName.DISABLED)){return;}
var target;var previous;var listElement=$$$1(this._element).closest(Selector.NAV_LIST_GROUP)[0];var selector=Util.getSelectorFromElement(this._element);if(listElement){var itemSelector=listElement.nodeName==='UL'?Selector.ACTIVE_UL:Selector.ACTIVE;previous=$$$1.makeArray($$$1(listElement).find(itemSelector));previous=previous[previous.length-1];}
var hideEvent=$$$1.Event(Event.HIDE,{relatedTarget:this._element});var showEvent=$$$1.Event(Event.SHOW,{relatedTarget:previous});if(previous){$$$1(previous).trigger(hideEvent);}
$$$1(this._element).trigger(showEvent);if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented()){return;}
if(selector){target=$$$1(selector)[0];}
this._activate(this._element,listElement);var complete=function complete(){var hiddenEvent=$$$1.Event(Event.HIDDEN,{relatedTarget:_this._element});var shownEvent=$$$1.Event(Event.SHOWN,{relatedTarget:previous});$$$1(previous).trigger(hiddenEvent);$$$1(_this._element).trigger(shownEvent);};if(target){this._activate(target,target.parentNode,complete);}else{complete();}};_proto.dispose=function dispose(){$$$1.removeData(this._element,DATA_KEY);this._element=null;};_proto._activate=function _activate(element,container,callback){var _this2=this;var activeElements;if(container.nodeName==='UL'){activeElements=$$$1(container).find(Selector.ACTIVE_UL);}else{activeElements=$$$1(container).children(Selector.ACTIVE);}
var active=activeElements[0];var isTransitioning=callback&&Util.supportsTransitionEnd()&&active&&$$$1(active).hasClass(ClassName.FADE);var complete=function complete(){return _this2._transitionComplete(element,active,callback);};if(active&&isTransitioning){$$$1(active).one(Util.TRANSITION_END,complete).emulateTransitionEnd(TRANSITION_DURATION);}else{complete();}};_proto._transitionComplete=function _transitionComplete(element,active,callback){if(active){$$$1(active).removeClass(ClassName.SHOW+" "+ClassName.ACTIVE);var dropdownChild=$$$1(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];if(dropdownChild){$$$1(dropdownChild).removeClass(ClassName.ACTIVE);}
if(active.getAttribute('role')==='tab'){active.setAttribute('aria-selected',false);}}
$$$1(element).addClass(ClassName.ACTIVE);if(element.getAttribute('role')==='tab'){element.setAttribute('aria-selected',true);}
Util.reflow(element);$$$1(element).addClass(ClassName.SHOW);if(element.parentNode&&$$$1(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)){var dropdownElement=$$$1(element).closest(Selector.DROPDOWN)[0];if(dropdownElement){$$$1(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);}
element.setAttribute('aria-expanded',true);}
if(callback){callback();}};Tab._jQueryInterface=function _jQueryInterface(config){return this.each(function(){var $this=$$$1(this);var data=$this.data(DATA_KEY);if(!data){data=new Tab(this);$this.data(DATA_KEY,data);}
if(typeof config==='string'){if(typeof data[config]==='undefined'){throw new TypeError("No method named \""+config+"\"");}
data[config]();}});};_createClass(Tab,null,[{key:"VERSION",get:function get(){return VERSION;}}]);return Tab;}();$$$1(document).on(Event.CLICK_DATA_API,Selector.DATA_TOGGLE,function(event){event.preventDefault();Tab._jQueryInterface.call($$$1(this),'show');});$$$1.fn[NAME]=Tab._jQueryInterface;$$$1.fn[NAME].Constructor=Tab;$$$1.fn[NAME].noConflict=function(){$$$1.fn[NAME]=JQUERY_NO_CONFLICT;return Tab._jQueryInterface;};return Tab;}($);(function($$$1){if(typeof $$$1==='undefined'){throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');}
var version=$$$1.fn.jquery.split(' ')[0].split('.');var minMajor=1;var ltMajor=2;var minMinor=9;var minPatch=1;var maxMajor=4;if(version[0]<ltMajor&&version[1]<minMinor||version[0]===minMajor&&version[1]===minMinor&&version[2]<minPatch||version[0]>=maxMajor){throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');}})($);exports.Util=Util;exports.Alert=Alert;exports.Button=Button;exports.Carousel=Carousel;exports.Collapse=Collapse;exports.Dropdown=Dropdown;exports.Modal=Modal;exports.Popover=Popover;exports.Scrollspy=ScrollSpy;exports.Tab=Tab;exports.Tooltip=Tooltip;Object.defineProperty(exports,'__esModule',{value:true});})));