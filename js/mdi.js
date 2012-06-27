/************************************************************************
 mdi.js
 script for Multiple Document Interface
 Author : romeoh (romeoh@naver.com)
 Version : 2012.06.10.16
 Copyright (c) 2012 romeoh
 ************************************************************************/

var mdi = {
	
	//initialize
	init: function(){
		mdi.components = document.querySelector("#components");
		mdi.idx = 0;
		mdi.selectedIdx = 0;
		mdi.zDepth = 0;
		mdi.docWidth = window.innerWidth;
		mdi.docHeight = window.innerHeight;
		mdi.newsIdx = 0;
		mdi.initNews();
	},
	
	//window
	createWindow: function(_url, _title, _width, _height){
		mdi.selectedIdx = mdi.idx;	
		
		//iframe contents
		mdi.createWindow.domIfr = document.createElement("iframe");
		with(mdi.createWindow.domIfr){
			style.height = _height - 32 + "px";
			style.width = _width - 2 + "px";
			src = _url;
		}
		
		//block iframe
		mdi.createWindow.blockIfr = document.createElement("div");
		with(mdi.createWindow.blockIfr){
			id = "blockIfr" + mdi.idx;
			style.position = "absolute"
			style.height = _height - 32 + "px";
			style.width = _width - 2 + "px";
			style.display = "none";
		}
		
		//window Title Text
		mdi.createWindow.windowTitleText = document.createElement("span");
		mdi.createWindow.windowTitleText.innerHTML = _title;
		
		//window Title bar
		mdi.createWindow.windowTitleBar = document.createElement("div");
		with(mdi.createWindow.windowTitleBar){
			id = "domWinTitle" + mdi.idx;
			className = "titleBar";
		}
		mdi.createWindow.windowTitleBar.appendChild(mdi.createWindow.windowTitleText);
		mdi.createWindow.windowTitleBar.setAttribute("data-drag-handler", "true");
		
		//window close button
		mdi.createWindow.windowCloseButton = document.createElement("button");
		with(mdi.createWindow.windowCloseButton){
			id = "domWinClose" + mdi.idx;
			className = "btnClose";
			innerHTML = "X";
		}
		
		//window minimum button
		mdi.createWindow.windowMiniButton = document.createElement("button");
		with(mdi.createWindow.windowMiniButton){
			id = "domWinMini" + mdi.idx;
			className = "btnMini";
			innerHTML = "-";
		}
		
		//window
		mdi.createWindow.window = document.createElement("div");
		with(mdi.createWindow.window){
			id = "domWin" + mdi.idx;
			style.width = _width + "px";
			style.height = _height + "px";
			style.top = mdi.docHeight / 2 - _height / 2 + 20 * mdi.idx + "px";
			style.left = mdi.docWidth / 2 - _width / 2 + 20 * mdi.idx + "px";
			style.zIndex = mdi.zDepth;
			className = "mdiWindow";
		}
		mdi.createWindow.window.setAttribute("data-window-index", mdi.idx);
		
		mdi.createWindow.window.appendChild(mdi.createWindow.windowTitleBar);
		mdi.createWindow.windowTitleBar.appendChild(mdi.createWindow.windowCloseButton);
		mdi.createWindow.windowTitleBar.appendChild(mdi.createWindow.windowMiniButton);
		mdi.createWindow.window.appendChild(mdi.createWindow.blockIfr);
		mdi.createWindow.window.appendChild(mdi.createWindow.domIfr);
		mdi.components.appendChild(mdi.createWindow.window);
		
		//status bar
		mdi.createWindow.status = document.createElement("div");
		with(mdi.createWindow.status){
			id = "domStatus" + mdi.idx;
			className = "statusWindow";
			innerHTML = _title;
		}
		mdi.createWindow.status.setAttribute("data-status-window-index", mdi.idx);
		mdi.components.appendChild(mdi.createWindow.status);
		
		//close status bar
		mdi.createWindow.closeStatus = document.createElement("button");
		with(mdi.createWindow.closeStatus){
			id = "domCloseStatus" + mdi.idx;
			innerHTML = "X";
		}
		mdi.createWindow.status.appendChild(mdi.createWindow.closeStatus);
		
		mdi.initWindowEvent();
		mdi.reArrangeStatus();
	},
	
	//window drag Event
	initWindowEvent: function(){
		document.querySelector("#domWinTitle" + mdi.idx).addEventListener("touchstart", mdi.onWindowDownHandler, true);
		document.querySelector("#domWinTitle" + mdi.idx).addEventListener("mousedown", mdi.onWindowDownHandler, true);
		
		//status - window
		document.querySelector("#domStatus" + mdi.idx).addEventListener("touchstart", mdi.activeStatus, false);
		document.querySelector("#domStatus" + mdi.idx).addEventListener("mousedown", mdi.activeStatus, false);
		
		//status - close
		document.querySelector("#domCloseStatus" + mdi.idx).addEventListener("touchstart", mdi.getStatusIndex, false);
		document.querySelector("#domCloseStatus" + mdi.idx).addEventListener("mousedown", mdi.getStatusIndex, false);
		
		mdi.zDepth++;
		mdi.idx++;
	},
	
	//Drag Event
	onWindowDownHandler: function(_event){
		_event.preventDefault();
		//_event.stopPropagation();
		mdi.isMouseDown = true;
		mdi.dragTarget = _event.target;
		
		var tmpIdx = true;
		while(tmpIdx){
			if(mdi.dragTarget.getAttribute("data-drag-handler")){
				mdi.selectedIdx = mdi.dragTarget.id.substr(11);
				tmpIdx = false;
			}else{
				mdi.dragTarget = _event.target.parentNode;
			}
		}
		mdi.activeWindow = mdi.dragTarget.parentNode;
		mdi.activeWindow.querySelector("#blockIfr"+mdi.selectedIdx).style.display = "block";
		
		//status
		for(var i=0; i<mdi.reArrangeStatus.statusLength.length; i++){
			if(mdi.selectedIdx == i){
				mdi.addClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}else{
				mdi.removeClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}
		}
		
		if(_event.type == "touchstart"){
			document.addEventListener("touchmove", mdi.onWindowMoveHandler, false);
			document.addEventListener("touchend", mdi.onWindowUpHandler, false);
		}else{
			document.addEventListener("mousemove", mdi.onWindowMoveHandler, false);
			document.addEventListener("mouseup", mdi.onWindowUpHandler, false);
		}
		//console.log(document.querySelector("#domCloseStatus" + mdi.selectedIdx))
		document.querySelector("#domWinClose" + mdi.selectedIdx).addEventListener("touchstart", mdi.removeWindowHandler, false);
		document.querySelector("#domWinClose" + mdi.selectedIdx).addEventListener("mousedown", mdi.removeWindowHandler, false);
		document.querySelector("#domWinMini" + mdi.selectedIdx).addEventListener("touchstart", mdi.onWindowMiniHandler, false);
		document.querySelector("#domWinMini" + mdi.selectedIdx).addEventListener("mousedown", mdi.onWindowMiniHandler, false);
		
		mdi.activeWindow.style.zIndex = mdi.zDepth;
		mdi.zDepth++;
	},
	
	onWindowMoveHandler: function(_event){
		if(mdi.isMouseDown){
			if(!mdi.windowHandlerX) mdi.windowHandlerX = _event.pageX - parseInt(mdi.activeWindow.style.left);
			if(!mdi.windowHandlerY) mdi.windowHandlerY = _event.pageY - parseInt(mdi.activeWindow.style.top);
			mdi.activeWindow.style.left = _event.pageX - mdi.windowHandlerX + "px";
			mdi.activeWindow.style.top = _event.pageY - mdi.windowHandlerY + "px";
		}
	},
	
	onWindowUpHandler: function(){
		try{
			mdi.activeWindow.querySelector("#blockIfr"+mdi.selectedIdx).style.display = "none";
		}catch(e){}
		document.removeEventListener("mousemove", mdi.onWindowMoveHandler, false);
		document.removeEventListener("mouseup", mdi.onWindowUpHandler, false);
		document.removeEventListener("touchmove", mdi.onWindowMoveHandler, false);
		document.removeEventListener("touchend", mdi.onWindowUpHandler, false);
		mdi.windowHandlerX = null;
		mdi.windowHandlerY = null;
	},
	
	//reArrangeStatus
	reArrangeStatus: function(_param){
		mdi.reArrangeStatus.statusLength = document.querySelectorAll("[data-status-window-index]");
		for(var i=0; i<mdi.reArrangeStatus.statusLength.length; i++){
			if(mdi.reArrangeStatus.statusLength.length-1 == i){
				mdi.addClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}else{
				mdi.removeClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}
			
			if(!_param){
				mdi.reArrangeStatus.statusLength[i].style.left = 165*i + "px";
			}else{
				mdi.tween(mdi.reArrangeStatus.statusLength[i], {left:165*i, time:.4});
			}
		}
		//console.log(mdi.selectedIdx)
		mdi.selectedIdx = mdi.reArrangeStatus.statusLength.length;
	},
	
	//active Status
	activeStatus: function(_event){
		mdi.selectedIdx = _event.target.id.substr(9);
		for(var i=0; i<mdi.reArrangeStatus.statusLength.length; i++){
			if(mdi.selectedIdx == i){
				mdi.addClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}else{
				mdi.removeClass(mdi.reArrangeStatus.statusLength[i], "activeWindow");
			}
		}
		
		mdi.addClass(_event.target, "activeWindow");
		try{
			document.querySelector("#domWin" + mdi.selectedIdx).style.zIndex = mdi.zDepth;
		}catch(e){}
		mdi.zDepth++;
	},
	
	//get status idx
	getStatusIndex: function(_event){
		mdi.selectedIdx = _event.target.id.substr(14);
		mdi.removeWindowHandler()
	},
	
	//close button
	removeWindowHandler: function(_event){
		mdi.components.removeChild(document.querySelector("#domWin" + mdi.selectedIdx));
		mdi.components.removeChild(document.querySelector("#domStatus" + mdi.selectedIdx));
		mdi.reArrangeStatus("reassign");
	},
	
	//minimun button
	onWindowMiniHandler: function(_event){
		//alert("mini")
		//mdi.components.removeChild(document.querySelector("#domWin" + mdi.selectedIdx));
	},
	
	//news scroll
	initNews: function(){
		mdi.newsLength = document.querySelectorAll("[data-news-idx]").length;
		mdi.newsInterval = setInterval(mdi.scrollNews, 2000);
	},
	
	scrollNews: function(){
		mdi.tween(document.querySelector("[data-news-idx='"+mdi.newsIdx+"']"), {top:-30});
		if(mdi.newsIdx >= mdi.newsLength-1) mdi.newsIdx = 0;
		else mdi.newsIdx++;
		document.querySelector("[data-news-idx='"+mdi.newsIdx+"']").style.top = "30px";
		mdi.tween(document.querySelector("[data-news-idx='"+mdi.newsIdx+"']"), {top:0, delay:.5});
	},
	
	//submenu
	showSubMenu: function(_obj, _top, _sub){
		if(mdi.subMenuIdx){
			//i = document.querySelector("[data-top="+mdi.subMenuIdx.getAttribute("data-top").substr(1)+"]")
			i = mdi.subMenuIdx.toString().substr(0)
			console.log(i)
		}
		mdi.subMenuIdx = _obj.getAttribute("data-top") + _obj.getAttribute("data-sub");
	//	console.log(mdi.subMenuIdx)
		
			//alert(document.querySelector("#subMenu" + (mdi.subMenuIdx-1)).id)
			//console.log(_obj)
		//	_obj.removeChild(document.querySelector("#subMenu" + (mdi.subMenuIdx-1)));
		
		mdi.popover = document.createElement("div");
		with(mdi.popover){
			className = "popover";
			id = "subMenu" + mdi.subMenuIdx;
		}
		_obj.appendChild(mdi.popover);
		mdi.subMenuIdx++;
		
		mdi.arrow = document.createElement("div");
		with(mdi.arrow){
			
		}
		mdi.popover.appendChild(mdi.arrow);
		
		for(var i=0; i<mdi.gnb[_top].length; i++){
			mdi.menuContent = document.createElement("p");
			with(mdi.menuContent){
				innerHTML = mdi.gnb[_top][i].title;
			}
			mdi.popover.appendChild(mdi.menuContent);
		}
	},
	
	//add class
	addClass: function(_obj, _class){
		if(_obj.className.indexOf(_class) == -1){
			_obj.className = _obj.className + " " + _class;
		}
	},
	
	//remove class
	removeClass: function(_obj, _class){
		_obj.className = _obj.className.replace(_class, "");
	},
	
	//Motion
	tween: function(_obj, _param){
		mdi.motionObj		= _obj;
		mdi.aTop 			= _param.top;
		mdi.aLeft 			= _param.left;
		mdi.aRight 			= _param.right;
		mdi.aBottom 		= _param.bottom;
		mdi.aWidth			= _param.width;
		mdi.aHeight			= _param.height;
		mdi.aRotation		= _param.rotation;
		mdi.aScale			= _param.scale;
		mdi.aSkew			= _param.skew;
		mdi.aOpacity		= _param.opacity;
		
		mdi.aBorderColor	= _param.borderColor;
		mdi.aBgColor		= _param.bgColor;
		
		mdi.aDropShadow		= _param.dropShadow;
		
		mdi.aTime 			= _param.time;
		mdi.aDelay 			= _param.delay;
		mdi.aTransition 	= _param.transition;		//ease, ease-in, ease-out, ease-in-out, linear, cubic-bezier(1, 0, 0, 0)
		
		if(_param.onFinish) mdi.aFinish = _param.onFinish;
		else mdi.aFinish = undefined;
		mdi.aFinishParam 	= _param.onFinishParam;
		
		mdi.rotationText	= "";
		mdi.scaleText		= "";
		mdi.skewText		= "";
		mdi.styleText		= "";
		
		//default
		if(!mdi.aTime) mdi.aTime = 1;
		if(!mdi.aTransition) mdi.aTransition = "easeIn";
		if(!mdi.aDelay) mdi.aDelay = 0;
		if(document.defaultView.getComputedStyle(mdi.motionObj, null).position == "static") obj.style.position += "relative";
		
		//transition
		mdi.styleText += "-webkit-transition-delay:" + mdi.aDelay + "s; ";
		mdi.styleText += "-webkit-transition-duration:" + mdi.aTime + "s; ";
		mdi.styleText += "-webkit-transition-property:all; ";
		mdi.styleText += "-webkit-transition-timing-function:" + mdi.aTransition + "; ";
		mdi.styleText += "-moz-transition-delay:" + mdi.aDelay + "s; ";
		mdi.styleText += "-moz-transition-duration:" + mdi.aTime + "s; ";
		mdi.styleText += "-moz-transition-property:all; ";
		mdi.styleText += "-moz-transition-timing-function:" + mdi.aTransition + "; ";
		mdi.styleText += "-o-transition-delay:" + mdi.aDelay + "s; ";
		mdi.styleText += "-o-transition-duration:" + mdi.aTime + "s; ";
		mdi.styleText += "-o-transition-property:all; ";
		mdi.styleText += "-o-transition-timing-function:" + mdi.aTransition + "; ";
		mdi.styleText += "-ms-transition-delay:" + mdi.aDelay + "s; ";
		mdi.styleText += "-ms-transition-duration:" + mdi.aTime + "s; ";
		mdi.styleText += "-ms-transition-property:all; ";
		mdi.styleText += "-ms-transition-timing-function:" + mdi.aTransition + "; ";
		mdi.styleText += "transition-delay:" + mdi.aDelay + "s; ";
		mdi.styleText += "transition-duration:" + mdi.aTime + "s; ";
		mdi.styleText += "transition-property:all; ";
		mdi.styleText += "transition-timing-function:" + mdi.aTransition + "; ";
		
		//property 
		if(mdi.aTop != undefined) 			mdi.styleText += "top:" + mdi.aTop + "px; ";
		if(mdi.aLeft != undefined) 			mdi.styleText += "left:" + mdi.aLeft + "px; ";
		if(mdi.aRight != undefined) 		mdi.styleText += "right:" + mdi.aRight + "px; ";
		if(mdi.aBottom != undefined) 		mdi.styleText += "bottom:" + mdi.aBottom + "px; ";
		if(mdi.aWidth != undefined) 		mdi.styleText += "width:" + mdi.aWidth + "px; ";
		if(mdi.aHeight != undefined) 		mdi.styleText += "height:" + mdi.aHeight + "px; ";
		if(mdi.aOpacity != undefined) 		mdi.styleText += "opacity:" + mdi.aOpacity + "; ";
		if(mdi.aBorderColor != undefined)	mdi.styleText += "border-color:" + mdi.aBorderColor + "; ";
		
		//rotation, scale, skew
		if(mdi.aRotation != undefined) 		mdi.rotationText = "rotate(" + mdi.aRotation + "deg) ";
		if(mdi.aScale != undefined) 		mdi.scaleText = "scale(" + mdi.aScale + ") ";
		if(mdi.aSkew != undefined) 			mdi.scaleText = "skew(" + mdi.aSkew + "deg) ";
		mdi.styleText += "-webkit-transform:" + mdi.rotationText + mdi.scaleText + "; ";
		mdi.styleText += "-moz-transform:" + mdi.rotationText + mdi.scaleText + "; ";
		mdi.styleText += "-o-transform:" + mdi.rotationText + mdi.scaleText + "; ";
		mdi.styleText += "-ms-transform:" + mdi.rotationText + mdi.scaleText + "; ";
		mdi.styleText += "transform:" + mdi.rotationText + mdi.scaleText + "; ";
		
		//bgColor, dropShadow
		this.bgImage = document.defaultView.getComputedStyle(mdi.motionObj, null).backgroundImage;
		this.bgImageRepeat = document.defaultView.getComputedStyle(mdi.motionObj, null).backgroundRepeat;
		this.bgImagePositionX = document.defaultView.getComputedStyle(mdi.motionObj, null).backgroundPositionX;
		this.bgImagePositionY = document.defaultView.getComputedStyle(mdi.motionObj, null).backgroundPositionY;
		this.originalBackgroundImage = this.bgImage + " " + this.bgImageRepeat + " " + this.bgImagePositionX + " " + this.bgImagePositionY
		if(mdi.aBgColor != undefined) mdi.styleText += "background:" + mdi.aBgColor + " " + originalBackgroundImage + "; ";
		if(mdi.aDropShadow != undefined) {
			mdi.styleText += "-webkit-box-shadow:" + mdi.aDropShadow + "; ";
			mdi.styleText += "-moz-box-shadow:" + mdi.aDropShadow + "; ";
			mdi.styleText += "-o-box-shadow:" + mdi.aDropShadow + "; ";
			mdi.styleText += "-ms-box-shadow:" + mdi.aDropShadow + "; ";
			mdi.styleText += "box-shadow:" + mdi.aDropShadow + "; ";
		}
		mdi.motionObj.style.cssText += mdi.styleText;
		
		//CallBack??
		function CBData(){
			this.callbackFunction = [];
			this.callbackParam = [];
		}
		CBData.prototype.setCallback = function(cb){
			this.callbackFunction = cb;
		}
		CBData.prototype.getCallback = function(){
			return this.callbackFunction;
		}
		CBData.prototype.setParam = function(pam){
			this.callbackParam = pam;
		}
		CBData.prototype.getParam = function(){
			return this.callbackParam;
		}
		CBData.prototype.cb = function(e){
			var callCb = cbCall.getCallback();
			var callParam = cbCall.getParam();
			
			if(callParam) callbackParam = callParam;
			else callbackParam = "";
			
			if(typeof callCb == "function") callCb(callbackParam);
			else if(typeof callCb == "string") eval(callCb)(callbackParam);
			
			e.target.removeEventListener("webkitTransitionEnd", cbCall.cb, false);
			resetMotion(e.target);
		}
		
		var cbCall = new CBData();
		if(mdi.aFinish) cbCall.setCallback(mdi.aFinish);
		if(mdi.aFinishParam) cbCall.setParam(mdi.aFinishParam);
		
		mdi.motionObj.addEventListener("webkitTransitionEnd", cbCall.cb, false);
		
		function resetMotion(_obj){
			with(_obj){
				style['-webkit-transition-delay'] = "";
				style['-webkit-transition-duration'] = "";
				style['-webkit-transition-property'] = "";
				style['-webkit-transition-timing-function'] = "";
				style['-moz-transition-delay'] = "";
				style['-moz-transition-duration'] = "";
				style['-moz-transition-property'] = "";
				style['-moz-transition-timing-function'] = "";
				style['-o-transition-delay'] = "";
				style['-o-transition-duration'] = "";
				style['-o-transition-property'] = "";
				style['-o-transition-timing-function'] = "";
				style['-ms-transition-delay'] = "";
				style['-ms-transition-duration'] = "";
				style['-ms-transition-property'] = "";
				style['-ms-transition-timing-function'] = "";
				style['transition-delay'] = "";
				style['transition-duration'] = "";
				style['transition-property'] = "";
				style['transition-timing-function'] = "";
			}
		}
	}
}