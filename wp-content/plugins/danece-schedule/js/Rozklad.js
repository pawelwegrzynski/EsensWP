//var styleDescWindow;

function chmurka(d,E,b,i,a)
{
  d=document;E=d.documentElement;b=d.body;if(!E)return;
  for(i=0;a=b.getElementsByTagName("div")[i];i++)
  {
    if(a.title)
	{
      with(a.t=d.createElement("div"))
	  {
        id="chmurka"
        innerHTML=a.title.replace(/\|/g,"<br />")
      }
      a.onmouseover=function(e)
	  {
        with(this){title="";onmousemove(e)}
        b.appendChild(this.t)
      }
      a.onmouseout=function(x)
	  {
        with(this){title=t.innerHTML.replace(/<br \/>/g,"\|")}
        if(x=d.getElementById("chmurka"))b.removeChild(x)
      }
      a.onmousemove=function(e)
	  {
        e=e||event;with(this.t.style)
		{
         if (e.clientX<=document.body.clientWidth-200) 
		 {
		 	left=e.clientX+(E.scrollLeft||b.scrollLeft)+"px";
		 }
		 else
		 {
			left=e.clientX+(E.scrollLeft||b.scrollLeft)-320+"px";
		 }
	
		 if (e.clientY<=document.body.clientHeight-200) 
		 {
			top=e.clientY+(E.scrollTop||b.scrollTop)+"px";
		 }
		 else
		 { 
			top=e.clientY+(E.scrollTop||b.scrollTop)-240+"px";
		 }
		 
        }
      }
    }
  }
}
function addEvent(O,E,F,x)
{
  return(x=O.addEventListener)?x(E,F,1):(x=O.attachEvent)?x('on'+E,F):!1
}
addEvent(window,'load',chmurka);

function checkBoxChecking(checkBoxName,check)
{ 
	var colCheckBox=checkBoxName.split(",");
	
	for(i in colCheckBox)
	{  
		var elCheckBox=document.getElementById(colCheckBox[i]);
		if (elCheckBox)
		{
			if (check)
			{
				elCheckBox.checked=true;
			}
			else
			{
				elCheckBox.checked=false;
			}
		}
	}
	
}
	
function openMap(Page)
{
  window.open( Page, 'esPage',
	'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=500,height=450' );
}

function openLegend(page)
{
	window.open( page, 'pageDescription',
	'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=800,height=400' );
}

function openOpis(page)
{
	window.open( page, 'pageGroupDescription',
	'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=800,height=400' );
}

function openReport()
{
	window.open('', 'pageReport',
		'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=800,height=600' );
}

function openPlanPrm(page)
{
	window.open(page, 'pageBooking',
		'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=800,height=600' );
}

function openStyleDesc(urlPage)
{
    var styleDescWindow=window.open(urlPage, 'pageStyleDesc',
                    'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=785,height=500' );
    var objForm=document.getElementById('mainForm');
    if (objForm)
    {
        objForm.action=urlPage;
        objForm.target='pageStyleDesc';
    }
}

function closeStyleDesc(urlPage)
{
    var styleDescWindow=openStyleDesc(urlPage); 
    styleDescWindow.close();
}

function openTeacherDesc(urlPage)
{
    var teacherDescWindow=window.open(urlPage, 'pageTeacherDesc',
                    'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=no,scrollbars=yes,width=785,height=500' );
    //if (urlPage != null){
        //teacherDescWindow.location.replace(urlPage);
        //teacherDescWindow.document.write('<html><body>...</body></html>');
    //}
    //return teacherDescWindow;
    var objForm=document.getElementById('mainForm');
    if (objForm)
    {
        //objForm.action='http://plan.esens.com.pl/EsensPlan/openURL.php';
        objForm.action=urlPage;
        objForm.target='pageTeacherDesc';
    }
}

function closeTeacherDesc(urlPage)
{
	var teacherDescWindow=openTeacherDesc(null);
	teacherDescWindow.close();
}

function openLevelDesc(urlPage)
{
	var levelDescWindow=window.open(urlPage, 'pageLevelDesc',
			'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=600,height=100' );
	return levelDescWindow;
}

function closeLevelDesc(urlPage)
{
	var levelDescWindow=openLevelDesc(urlPage);
	levelDescWindow.close();
}

function openReportPdf()
{
	openReport();
	objForm=document.getElementById('mainForm');
	if (objForm)
	{
		objForm.action='createPdf.php';
		objForm.target='pageReport';
	}
}

function openBooking(page)
{
	window.open(page, 'pageBooking',
		'menubar=no,toolbar=no,location=no,directories=no,status=no,channelmode=no,resizable=yes,scrollbars=yes,width=1000,height=600' );
}
function openBookingWindow()
{
	openBooking('');
	objForm=document.getElementById('mainForm');
	if (objForm)
	{
		objForm.action='rozklad.php';
		objForm.target='pageBooking';
	}
}

/*function openStyleDescription(url,idStyle)
{	
	if (idStyle.substr(0,2)!='fr')
	{
		urlPage=url+'styleTaneczne.php?idStyl='+idStyle;
		closeStyleDesc(urlPage);
		var styleDescWindow=openStyleDesc(urlPage);
	}
}*/

/*function openTeacherDescription(url,idTeacher)
{
	urlPage=url;//+'nauczyciele.php?idInstruktor='+idTeacher;
	closeTeacherDesc(null);
	openTeacherDesc(urlPage);
}*/

function openLevelDescription(url,idLevel)
{
	urlPage=url+'poziomZaawansowania.php?idPoziomZaawansowania='+idLevel;
	closeLevelDesc(urlPage);
	openLevelDesc(urlPage);
}

function clearFormPrm()
{
	objForm=document.getElementById('mainForm');
	if (objForm)
	{
		objForm.action='';
		objForm.target='';
	}
}

function showTextbox(idZrodla)
{ 
	if( idZrodla == '9' )
   	{
		document.getElementById('zrodloInformacji').style.display='block';
		document.getElementById('inne').style.display='block';
   	}
   	else
   	{
		document.getElementById('zrodloInformacji').style.display='none';
		document.getElementById('inne').style.display='none';
		document.getElementById('inne').value='';
   	}
}

//function showTextboxesDiscount(idKarty)
//{
//	if( idKarty == '0' )
//	{
//		document.getElementById('kartaRabatowaNumerKarty').style.display='none';
//		document.getElementById('kartaRabatowaNumer').style.display='none';
//		document.getElementById('kartaRabatowaNumer').value='';
//		document.getElementById('kartaRabatowaNazwaFirmy').style.display='none';
//		document.getElementById('kartaRabatowaFirma').style.display='none';
//		document.getElementById('kartaRabatowaFirma').value='';
//		document.getElementById('kartaRabatowaDataWaznosci').style.display='none';
//		document.getElementById('kartaRabatowaDataDzien').style.display='none';
//		document.getElementById('kartaRabatowaDataDzien').value='';
//		document.getElementById('kartaRabatowaDataMiesiac').style.display='none';
//		document.getElementById('kartaRabatowaDataMiesiac').value='';
//		document.getElementById('kartaRabatowaDataRok').style.display='none';
//		document.getElementById('kartaRabatowaDataRok').value='';
//		document.getElementById('kartaRabatowaDataMyslnik1').style.display='none';
//		document.getElementById('kartaRabatowaDataMyslnik2').style.display='none';
//		document.getElementById('kartaRabatowaDataOpis').style.display='none';
//		
//	}
//	else
//	{
//		document.getElementById('kartaRabatowaNumerKarty').style.display='block';
//		document.getElementById('kartaRabatowaNumer').style.display='block';
// 		
//		if( idKarty == '4')
//		{ 
//			document.getElementById('kartaRabatowaNazwaFirmy').style.display='none';
//			document.getElementById('kartaRabatowaFirma').style.display='none';
//		}
//		else
//		{
//			document.getElementById('kartaRabatowaNazwaFirmy').style.display='block';
//			document.getElementById('kartaRabatowaFirma').style.display='block';
//		}
//		document.getElementById('kartaRabatowaDataWaznosci').style.display='inline';
//		document.getElementById('kartaRabatowaDataDzien').style.display='inline';
//		document.getElementById('kartaRabatowaDataMiesiac').style.display='inline';
//		document.getElementById('kartaRabatowaDataRok').style.display='inline';
//		document.getElementById('kartaRabatowaDataMyslnik1').style.display='inline';
//		document.getElementById('kartaRabatowaDataMyslnik2').style.display='inline';
//		document.getElementById('kartaRabatowaDataOpis').style.display='inline';
//	
//	}
//}

//function showRadiobuttonsPayment(idKarty)
//{alert(idKarty);
//	if (idKarty=='2' || idKarty=='3')
//	{
//		document.getElementById('zaplataZaliczka').style.display='none';
//		document.getElementById('zaplataRata').style.display='none';
//	}
//	else
//	{
//		document.getElementById('zaplataZaliczka').style.display='inline';
//		document.getElementById('zaplataRata').style.display='inline';
//	}
//	
//}

function setValue(ident,wartosc)
{ 
    document.getElementById(ident).value=wartosc;
}

function clearValue(ident)
{
    document.getElementById(ident).value='';
}

function setCheckBox(idCheckBox,checked)
{
    if (checked)
    {  
        document.getElementById(idCheckBox).checked=true;
    }
}					  

function scrollWindow()
{
    var objWindowOffset=document.getElementById('windowOffsetY');
    if (objWindowOffset)
    {
        if (objWindowOffset.value)
        {
            window.scrollTo(0,objWindowOffset.value);
        }
    }
}

function resetOffset()
{
    var objWindowOffset=document.getElementById('windowOffsetY');
    if (objWindowOffset)
    {
        objWindowOffset.value=0;
    }
}

function correctDateDayMonth(elName)
{ 
    var elValue=document.getElementById(elName).value;
    if (elValue.length==1)
    {
        document.getElementById(elName).value='0'+elValue;
    }
		
}

function correctDateYear(elName)
{
    var elValue=document.getElementById(elName).value;
    if (elValue.length==1)
    {
        document.getElementById(elName).value='200'+elValue;
    }
    else if(elValue.length==2)
    {
        document.getElementById(elName).value='19'+elValue;
    }
    else if(elValue.length==3)
    {
        document.getElementById(elName).value=elValue+'0';	
    }
	
}

function setFilterElReadOnly()
{   
	var objEl=document.getElementById('mainForm');
	if (objEl)
	{
		for(var i=0;i<objEl.length;i++)
		{
			if (objEl.elements[i].type=='checkbox')
			{
				objEl.elements[i].disabled=true;
			}
		}
	}
}

function setFilterElReadWrite()
{
	var objEl=document.getElementById('mainForm');
	if (objEl)
	{
		for(var i=0;i<objEl.length;i++)
		{
			if (objEl.elements[i].type=='checkbox')
			{
				objEl.elements[i].disabled=false;
			}
		}
		
	}
}


function showProgressImage()
{
    var objEl=document.getElementById('progressArea');
    var objWindowOffset=document.body.scrollTop;
    var offsetY=0;
    var winHeight=400;
    var winWidth=800;

    if (document.body.scrollTop)
    {
        offsetY=parseInt(document.body.scrollTop);
    }

    if (screen.availHeight)
    {
        winHeight=parseInt(screen.availHeight);
    }

    if (screen.availWidth)
    {
        winWidth=parseInt(screen.availWidth);
    }

    if (objEl)
    { 
        objEl.style.top=offsetY + Math.round(winHeight/4);
        objEl.style.left=Math.round(winWidth/2);
        objEl.className='progressArea';	
    }
		
}

function setReadOnlyArea()
{
    var objEl=document.getElementById('readOnlyArea');

    if (objEl)
    {
        objEl.className='readOnlyArea';	
    }
}

function disableReadOnlyArea()
{
    var objEl=document.getElementById('readOnlyArea');

    if (objEl)
    {
        objEl.className='readOnlyAreaDisabled';
    }
}

function mouseOver(idEl)
{
    var objEl=document.getElementById(idEl);
    if (objEl)
    { 
        objEl.style.fontWeight='bold';
    }
}

function mouseOut(idEl)
{
    var objEl=document.getElementById(idEl);
    if (objEl)
    { 
        objEl.style.fontWeight='normal';
    }
}

function clickElement(idEl)
{
    var objEl=document.getElementById(idEl);
    if (objEl)
    { 
        objEl.click();
    }
}
    