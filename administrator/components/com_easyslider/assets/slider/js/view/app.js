void function(exports,$,_,Backbone){exports.ES_App=B.View.extend({constructor:function ES_App(options){_.bindAll(this,"undo","redo","copy","paste","saveSlider","addSlide","removeSlide","addItemBox","moveItems","removeItems","setActive","updateSelected","updateBoundingBox","resizeCanvas","resizeSlider","toggleAnimationPreview","resetAnimationPreview","stopAnimationPreview");this.updateSelected=_.debounce(this.updateSelected);this.setActive=_.debounce(this.setActive);options||(options={});B.View.call(this,options);this.model.set({id:options.id,title:options.title});!options.id&&_.defer(this.model.save)},views:{"itemsView > #items":ES_ItemsView,"globalItemsView collection:items > #global-items":ES_GlobalItemsView,"selectionsView > #selections":ES_SelectionsView,"thumbsView collection:slides > .es-thumbs":ES_ThumbsView,"gridsView model:grid > .es-grids":ES_GridsView,"timelineView > .es-timeline":ES_TimelineView,"layersView > .es-layers":ES_LayersView,"framesView > .es-frames":ES_FramesView,"canvasView > .es-canvas-wrapper":ES_CanvasView,"mediumToolbar > #medium-toolbar":ES_MediumToolbar,"fontAwesomePicker > #font-awesome-picker":ES_FontAwesomePicker,"colorPicker > #color-picker":ES_ColorPicker,"fontsPicker > #fonts-picker":ES_FontsPicker,"boxShadowInspector > #box-shadow-inspector-panel":ES_BoxShadowInspector,"textShadowInspector > #text-shadow-inspector-panel":ES_TextShadowInspector,"thumbMenu > #thumb-menu":ES_InspectorView.extend(),"itemInspector > #item-inspector":ES_ItemInspector,"animationInspector > #animation-inspector":ES_AnimationInspector,"settingsPanel model:$model > #settings-panel":ES_SettingsPanel,"configSizeView model:$model > #quick-setting-panel":ES_QuickSettingsPanel,"configGridView model:grid > #grid-config":ES_PanelView,"customJSEditor model:$model> #custom-js-editor":ES_CustomJSEditor,"customCSSEditor model:$model> #custom-css-editor":ES_CustomCSSEditor,"tooltipView > #tooltip-panel":ES_Tooltip},modelEvents:{"add slides":"setActive","remove slides":"setActive","reset slides":"setActive","change:slides.active":"setActive","change:slides.items.selected":"updateSelected","change:slides.items.style":"updateBoundingBox","change:items.selected":"updateSelected","change:items.style":"updateBoundingBox","add items":"updateSelected","remove items":"updateSelected","change:width":"resizeCanvas","change:height":"resizeCanvas","change:layout":"resizeCanvas","change:origin":"resizeCanvas","change:state":function(){_(this.globalItemsView.subViews).each(function(view){view.__dataBinding.updateView()});_(this.itemsView.subViews).each(function(view){view.__dataBinding.updateView()});_(this.selectionsView.subViews).each(function(view){view.__dataBinding.updateView()});this.updateSelected()},"change:layout.type":"toggleTransitionSetting"},events:{"click .input-color":function(e){this.colorPicker.open({target:e.target})},"click .save-slider-btn":"saveSlider","click .exit-slider-btn":"exitSlider","click .add-item-btn":"addItemBox","click .add-image-btn":"addItemImage","click .add-text-btn":"addItemText","click .add-video-btn":"addItemVideo","click .add-slide-btn":"addSlide","click .remove-slide-btn":"removeSlide","click .duplicate-slide-btn":"duplicateSlide","click .es-overlay":"updateBoundingBox",dragstart:"hideBoundingBox",dragstop:"updateBoundingBox",resizestart:"hideBoundingBox",resizestop:"updateBoundingBox","click .slide-global-btn":"activateGlobalItems","click .edit-slider-bg-btn":function(){$.ES_MediaSelector(_.bind(function(src){this.model.set("background.image.src",src)},this))},"click .edit-slide-bg-btn":function(){$.ES_MediaSelector(_.bind(function(src){this.activeSlide.set("background.image.src",src)},this))},"click .open-advance-settings-btn":function(e){this.settingsPanel.open({})},"click .open-grid-config-panel":function(e){this.configGridView.open({target:e.currentTarget,direction:"left"})},"click .open-js-editor-btn":function(e){this.configSizeView.close();this.customJSEditor.open()},"click .open-css-editor-btn":function(e){this.configSizeView.close();this.customCSSEditor.open()},"click .switch-to-mode":function(e){e.stopPropagation();var mode=$(e.currentTarget).data("mode");var isModeEnable=this.model.get("layout."+mode);if(mode!="desktop"&&!isModeEnable)return;this.model.set("state.view_mode",mode);$(e.currentTarget).addClass("highlight").siblings().removeClass("highlight")},"click .slider-settings-btn":function(e){this.configSizeView.open({target:e.currentTarget,direction:"bottom"})},"click .timeline-toggle-btn":function(e){this.$(".es-layers-wrapper").toggleClass("es-collapsed");this.$(".timeline-toggle-btn").toggleClass("hidden")},"click .slider-quick-tour-btn":function(e){this.quickToursView.open()},"dragstart .es-canvas-wrapper":function(){this.itemInspector.close();this.animationInspector.close();this.hideBoundingBox()},"dragstop .es-canvas-wrapper":function(){this.updateBoundingBox()},"resizestart .es-canvas-wrapper":function(){this.itemInspector.close();this.animationInspector.close();this.hideBoundingBox()},"resizestop .es-canvas-wrapper":function(){this.updateBoundingBox()},scroll:function(e){},"mouseenter .es-tooltip":function(e){this.tooltipView.open({target:e.currentTarget})},"mouseleave .es-tooltip":function(e){this.tooltipView.close()},"mouseup .nav.nav-tab li":function(e){}},bindings:[{selector:".open-view-mode-selector-btn",type:"html",attr:"state.view_mode",parse:function(value){switch(value){case"laptop":return'<span class="fa fa-laptop"></span>';case"tablet":return'<span class="fa fa-tablet"></span>';case"mobile":return'<span class="fa fa-mobile"></span>';case"desktop":return'<span class="fa fa-television"></span>';default:return'<span class="fa fa-television"></span>'}}},{selector:".es-canvas .es-canvas-master-bg",type:"style",attr:{backgroundColor:"background.color",backgroundImage:"background.image.src",backgroundPosition:"background.position",backgroundSize:"background.size"},parse:function(value,key){switch(key){case"backgroundImage":return value?"url("+ES_App.getImageURL(value)+")":"";default:return value}}}],initialize:function(options){this.history=new ES_UndoStack(this.model);this.fontsLoader=new ES_Fonts;this.slides=this.model.get("slides");this.$thumbsWrapper=this.$(".es-thumbs-wrapper");this.$thumbsLayout=this.$(".es-thumbs-layout");this.$thumbsCenter=this.$(".es-thumbs-center");this.$canvasWrapper=this.$(".es-canvas-wrapper");this.$canvasLayout=this.$(".es-canvas-layout");this.$canvas=this.$(".es-canvas");this.$overlays=this.$(".es-overlay");this.$groups=this.$(".es-items,.es-selections");this.$layersWrapper=this.$(".es-layers-wrapper");this.$('.switch-to-mode[data-mode="'+this.model.get("state.view_mode")+'"]').addClass("highlight");new Medium({element:this.$(".es-header .title-input").get(0),mode:Medium.inlineRichMode});this.slideAnim=ES_Timeline({align:"normal",duration:4e3});Object.defineProperties(this.slideAnim,{tweens:{get:_.bind(function(){return _(this.itemsView.subViews).map(function(itemView){return itemView.animation})},this)}});this.listenTo(this.slideAnim,"end",this.stopAnimationPreview);$(window).resize(this.resizeSlider);$("body").on("click",".es-noty-close",function(e){$(e.currentTarget).parents(".noty_bar").parent().slideUp("normal",function(){$(this).remove()})});Mousetrap.bind("command+s",this.saveSlider);Mousetrap.bind(["shift+up","shift+down","shift+left","shift+right","up","down","left","right"],this.moveItems);Mousetrap.bind(["del","backspace"],this.removeItems);Mousetrap.bind(["command+shift+z"],this.redo);Mousetrap.bind(["command+z"],this.undo);Mousetrap.bind(["esc"],this.stopAnimationPreview);Mousetrap.bind(["space"],this.toggleAnimationPreview);Mousetrap.bind(["command+c"],this.copy);Mousetrap.bind(["command+v"],this.paste);Mousetrap.bind(["ctrl+c"],this.copy);Mousetrap.bind(["ctrl+v"],this.paste)},ready:function(){this.configSizeView.within=".es-canvas-wrapper";this.setActive();this.resizeCanvas();this.resizeSlider();this.slides.checkEmpty();this.toggleTransitionSetting();this.listenTo(this.model,"save:success",this.saveOnSuccess);this.listenTo(this.model,"save:error",this.saveOnError);this.listenTo(this.model,"change",this.onChangeData);this.dataChanged=false;this.quickToursView=new ES_QuickTours({el:"#quick-tours-panel"});this.quickToursView.close()},saveOnSuccess:function(e){noty({text:'<div class="activity-item"> <i class="fa fa-check text-success"></i> <div class="activity"> '+e+" </div> </div>",layout:"topRight",type:"success",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}});this.dataChanged=false},saveOnError:function(e){noty({text:'<div class="activity-item"> <i class="fa fa-warning text-error"></i> <div class="activity"> '+e+" </div> </div>",layout:"topRight",type:"error",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}})},onChangeData:function(e){this.dataChanged=true},undo:function(e){!e.shiftKey&&this.history.undo()},redo:function(e){e.shiftKey&&this.history.redo()},copy:function(e){var selected=this.activeItems.where({selected:true});if(!selected.length)return;this.clipboard=_(selected).map(function(item){return item.toJSON()});noty({text:'<div class="activity-item"> <i class="fa fa-check text-success"></i> <div class="activity"> '+selected.length+" item(s) copied. </div> </div>",layout:"topRight",type:"success",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}})},paste:function(e){if(!this.clipboard)return;this.activeItems.invoke("set","selected",false);this.activeItems.add(this.clipboard)},getActive:function(){return this.model.get("slides").findWhere({active:true})},setActive:function(model){var active=this.getActive();if(!active||active==this.activeSlide)return;this.itemsView.activate();this.globalItemsView.deactivate();this.activeSlide=active;this.activeItems=active.get("items");this.canvasView.setModel(this.activeSlide);this.canvasView.setBindingModel(this.activeSlide);this.timelineView.setModel(this.activeSlide);this.timelineView.setBindingModel(this.activeSlide);this.itemsView.setCollection(this.activeItems);this.layersView.setCollection(this.activeItems);this.framesView.setCollection(this.activeItems);this.selectionsView.setCollection(this.activeItems);this.slideAnim.duration=this.activeSlide.get("totalDuration");this.updateSelected();this.resizeSlider()},toggleTransitionSetting:function(){var $transitionTab=$("#slide-setting-transition-tab");switch(this.model.get("layout.type")){case 2:if($transitionTab.hasClass("active")){$transitionTab.prev().trigger("click")}$transitionTab.hide();break;case 1:$transitionTab.show();break}},toggleGlobalItems:function(){if(this.globalItemsView.activated)this.deactivateGlobalItems();else this.activateGlobalItems();return this.globalItemsView.activated},activateGlobalItems:function(){this.itemsView.deactivate();this.globalItemsView.activate();if(this.activeItems){this.activeItems.invoke("set","active",false)}this.activeSlide=null;this.activeItems=this.model.get("items");this.itemsView.deactivate();this.layersView.setCollection(this.activeItems);this.framesView.setCollection(this.activeItems);this.selectionsView.setCollection(this.activeItems);this.updateSelected();this.$(".es-thumb.selected").removeClass("selected");this.$(".slide-global-btn").addClass("selected");return this},deactivateGlobalItems:function(){this.globalItemsView.deactivate();this.itemsView.activate();this.model.get("items").invoke("set","active",false);this.activeSlide=null;this.setActive();this.$(".slide-global-btn").removeClass("selected");return this},updateSelected:function(){this.updateBoundingBox()},hideBoundingBox:function(){this.$(".es-bounding-box").hide()},updateBoundingBox:function(){var rect=this.selectionsView.$(".es-selection.selected .selection-offset").getBoundingBox();rect.width&&rect.height?this.$(".es-bounding-box").show().css(_.pick(rect,"top","left","width","height")):this.$(".es-bounding-box").hide();if(!this.activeItems)return;var selected=this.activeItems.where({selected:true});this.animationInspector.close();selected.length&&!this.mediumToolbar._openned?this.itemInspector.inspect(selected).open({target:this.$(".es-bounding-box")}):this.itemInspector.close()},resizeCanvas:function(){this.$canvas.add(this.$overlays).width(this.model.get("width")).height(this.model.get("height"));this.$groups.css({top:this.model.get("origin.y")*100+"%",left:this.model.get("origin.x")*100+"%"});this.gridsView.render()},resizeSlider:function(){this.$canvasLayout.css({minHeight:this.$canvas.outerHeight()+200+"px"});this.$thumbsLayout.css({minHeight:this.$thumbsCenter.outerHeight()+"px"});this.canvasView.resize();this.updateBoundingBox()},addSlide:function(){this.slides.addNew&&(this.slides.addNew(),this.thumbsView.$(".selected").trigger("options"))},removeSlide:function(){if(!this.activeSlide)return;var index=this.activeSlide.get("index");var $selected=this.thumbsView.$(".selected");var $next=$selected.next();var $prev=$selected.prev();this.slides.remove(this.activeSlide);this.defer(function(){($next.length?$next:$prev.length?$prev:this.thumbsView.$(".selected")).trigger("mousedown")})},duplicateSlide:function(){if(!this.activeSlide)return;var index=this.activeSlide.get("index");var cloneFromSlide=this.activeSlide;var clone=this.activeSlide.toJSON();this.slides.add(clone);cloneFromSlide.set("active",false)},addItemBox:function(){if(!this.activeItems)return;_(this.activeItems.where({selected:true})).invoke("set","selected",false);this.activeItems.add({type:"box",name:"Box",style_desktop:{visible:false,offset:{x:-50,y:-30},width:100,height:60,background:{color:"#d6d6d6"}},style_laptop:{visible:false},style_tablet:{visible:false},style_mobile:{visible:false},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:_.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:true,style:{visible:true}});this.itemInspector.showTab("style");this.defer(this.exitAnimationPreview)},addItemText:function(){if(!this.activeItems)return;_(this.activeItems.where({selected:true})).invoke("set","selected",false);this.activeItems.add({type:"text",content:"<div>Text</div>",style_desktop:{visible:false,offset:{x:-60,y:-30},width:120,height:60},style_laptop:{visible:false},style_tablet:{visible:false},style_mobile:{visible:false},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:_.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:true,style:{visible:true}});this.itemInspector.showTab("text");this.defer(this.exitAnimationPreview)},addItemImage:function(){if(!this.activeItems)return;_(this.activeItems.where({selected:true})).invoke("set","selected",false);$.ES_MediaSelector(_.bind(function(src){_.loadImage(ES_App.getImageURL(src),function(image){this.activeItems.add({type:"image",name:"Image",aspectRatio:image.width/image.height,style_desktop:{visible:false,background:{image:{src:src}},offset:{x:-image.width/2,y:-image.height/2},width:image.width,height:image.height},style_laptop:{visible:false},style_tablet:{visible:false},style_mobile:{visible:false},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:_.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:true,style:{visible:true}});this.itemInspector.showTab("background",true);this.defer(this.exitAnimationPreview)},this)},this))},addItemVideo:function(){if(!this.activeItems)return;_(this.activeItems.where({selected:true})).invoke("set","selected",false);this.activeItems.add({type:"video",name:"Video",style_desktop:{visible:false,offset:{x:-160,y:-100},width:320,height:200,background:{color:"#000"}},style_laptop:{visible:false},style_tablet:{visible:false},style_mobile:{visible:false},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:_.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:true,style:{visible:true}});this.itemInspector.showTab("video",true);this.defer(this.exitAnimationPreview)},moveItems:function(e,key){e&&e.preventDefault();this.selectionsView.$(".selection-offset.ui-selected").each(function(){var position=$(this).position();var step=e.shiftKey?10:1;switch(key){case"up":case"shift+up":position.top-=step;break;case"down":case"shift+down":position.top+=step;break;case"left":case"shift+left":position.left-=step;break;case"right":case"shift+right":position.left+=step;break}$(this).css(position).trigger("dragstop",{position:position})})},removeItems:function(e){e&&e.preventDefault();if(!this.activeItems)return;var selected=this.activeItems.where({selected:true});_(selected).each(function(model){model.collection.remove(model)})},saveSlider:function(event,callback){event&&event.preventDefault();this.model.save();if(typeof callback=="function"){callback.call()}},exitSlider:function(e){if(this.dataChanged){var message="Are you sure you want to leave this page? All unsaved changes will be lost.";var view=this;$(".exit-slider-modal").parents(".noty_bar").parent().remove();var message="Your slider's data has been changed! Do you want to save change?";noty({text:'<div class="activity-item"> <i class="fa fa-warning text-error"></i> <div class="activity"> '+message+" </div> </div>",template:'<div class="es-noty-close">&times;</div><div class="noty_message exit-slider-modal"><span class="noty_text"></span></div>',type:"confirm",layout:"center",theme:"relax",dismissQueue:true,closeWith:["click"],animation:{open:"animated flipInX",close:"animated flipOutX"},buttons:[{addClass:"btn btn-primary",text:"Yes",onClick:function($noty){view.saveSlider(e,function(){$noty.close();window.location=ES_Config.URL.SLIDERS_VIEW})}},{addClass:"btn btn-danger",text:"No",onClick:function($noty){$noty.close();window.location=ES_Config.URL.SLIDERS_VIEW}}]});$(".exit-slider-modal").parents(".noty_bar").parent().clickOutside(function(e){$(".exit-slider-modal").parents(".noty_bar").parent().slideUp("normal",function(){$(this).remove()})})}else{window.location=ES_Config.URL.SLIDERS_VIEW}},resetAnimationPreview:function(){this.stopAnimationPreview();this.startAnimationPreview()},toggleAnimationPreview:function(){if(!this.previewIsStarted)return this.startAnimationPreview();if(!this.previewIsPaused)return this.pauseAnimationPreview();if(this.previewIsPaused)return this.resumeAnimationPreview()},enterAnimationPreview:function(){_(this.itemsView.subViews).invoke("enterPreview");this.$(".timeline-preview-on").removeClass("hidden");this.$(".timeline-preview-off").addClass("hidden")},exitAnimationPreview:function(){_(this.itemsView.subViews).invoke("exitPreview");this.$(".timeline-preview-on").addClass("hidden");this.$(".timeline-preview-off").removeClass("hidden")},startAnimationPreview:function(){this.previewIsStarted=true;this.slideAnim.start();this.enterAnimationPreview();this.$(".timeline-resume-btn").hide();this.$(".timeline-pause-btn").show()},pauseAnimationPreview:function(){this.previewIsPaused=true;this.slideAnim.pause();this.$(".timeline-resume-btn").show();this.$(".timeline-pause-btn").hide()},resumeAnimationPreview:function(){this.previewIsPaused=false;this.slideAnim.resume();this.$(".timeline-resume-btn").hide();this.$(".timeline-pause-btn").show()},stopAnimationPreview:function(){this.previewIsStarted=false;this.exitAnimationPreview();this.slideAnim.stop()}},{getImageURL:function(src){if(src.match(/^(http|https):\/\//)){return src}if(src.match(/^\/?image/))return(ES_Config.URL.ROOT+"/"+src).replace(/\/+/,"/")}});exports.ES_UndoStack=_(function ES_UndoStack(model){if(!model)throw"No Backbone model provided";this.model=model;this.undoStack=[];this.redoStack=[];this.tracking=false;this.store=_.debounce(this.store,100)}).chain().setPrototypeOf(Backbone.Events).extendPrototype({start:function(){this.tracking=true;this.listenTo(this.model,"change",this.store);this.store();return this},stop:function(){this.tracking=false;this.stopListening(this.model,"change",this.store);return this},store:function(){if(this.tracking){this.undoStack.push(this.model.toJSON());while(this.redoStack.length)this.redoStack.pop()}return this},undo:function(){var tracking=this.tracking;this.stop();var data=this.undoStack.pop();data&&this.model.clear({silent:true}).set(data);this.redoStack.push(data);tracking&&this.start();return!!data},redo:function(){var tracking=this.tracking;this.stop();var data=this.redoStack.pop();data&&this.model.clear({silent:true}).set(data);this.undoStack.push(data);tracking&&this.start();return!!data}}).value()}(this,jQuery,_,JSNES_Backbone);