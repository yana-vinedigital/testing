
//
//	FRONTIER / UI / Carousel
//


'use strict';

//	Dev
// var log = require('bows')('UI.CAROUSEL');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var View = require('ampersand-view');



//	Carousel Point View
//	--------------------------------------------------

var CarouselPointView = View.extend({
	template: '<a href="#"></a>',

	props: {
		parent: 'state',
		index: ['number', true, 0]
	},

	derived: {
		isActive: {
			deps: ['parent._currentPage', 'index'],
			fn: function() {
				return this.parent._currentPage === this.index;
			}
		},
		// positionIndex: {
		// 	deps: ['parent._currentPage', 'index'],
		// 	fn: function() {
		// 		return this.index - this.parent._currentPage;
		// 	}
		// }
	},

	bindings: {
		'isActive': {
			type: 'booleanClass',
			name: 'is-active'
		},
		'model.questionClass': {
			type: 'class'
		},
		// 'positionIndex': {
		// 	type: function( el, value ) {
		// 		var perc = value === 0 ? 0 : 200 * ( value + ( value > 0 ? 1 : -1 ));
		// 		el.style[ FRONT.app._transformProperty ] = FRONT.app._hasTransforms3d ? 'translate3d(' + perc + '%, 0, 0)' : 'translate(' + perc + '%, 0)';
		// 	}
		// }
	},

	events: {
		'click': '_clickHandler'
	},

	//	Event Handlers	 ----------------

	_clickHandler: function( e ) {
		e.preventDefault();
		this.parent.gotoPage( this.index );
	},

});



//	Carousel Item View
//	--------------------------------------------------

var CarouselItemView = View.extend({

	props: {
		parent: 'state',
		index: ['number', true, 0],
		// offsetLeft: ['number', false, 0],
		$images: ['array']
	},

	derived: {
		// isActiveItem: {
		// 	deps: ['parent._selectedIndex', 'index'],
		// 	fn: function() {
		// 		return this.parent._selectedIndex === this.index;
		// 	}
		// },
		// positionClass: {
		// 	deps: ['parent._selectedIndex', 'index'],
		// 	fn: function() {
		// 		if ( this.index < this.parent._selectedIndex ) return '-is-prev';
		// 		if ( this.parent._selectedIndex === this.index ) return '-is-active';
		// 		if ( this.index > this.parent._selectedIndex ) return '-is-next';
		// 		return '';
		// 	}
		// },
		_offsetWidthPerc: {
			deps: ['parent._isReady', 'parent._viewportWidth'],
			fn: function() {
				if ( this.parent.hasPercentageLayout || !this.parent._isReady ) return 0;
				return Math.round( this.el.offsetWidth / this.parent._viewportWidth * 100 );
			}
		},
		_offsetLeftPerc: {
			deps: ['parent._isReady', 'parent._viewportWidth'],
			fn: function() {
				if ( this.parent.hasPercentageLayout || !this.parent._isReady ) return 0;
				return Math.round( this.el.firstElementChild.offsetLeft / this.parent._viewportWidth * 100 );
			}
		}
	},

	// bindings: {
	// 	// 'isActiveItem': {
	// 	// 	type: 'booleanClass',
	// 	// 	yes: '-is-active'
	// 	// }
	// 	'positionClass': {
	// 		type: 'class'
	// 	},
	// },

	initialize: function() {
		this.$images = this.queryAll('img');
		this._setupImages();
		// this.listenTo( this.parent, 'carousel:ready', this._updatePosition );
	},

	//	Private Methods	 ----------------
		
	_updatePosition: function() {
		// if ( !Utils.isElement( this.el.firstElementChild ) ) { return; }
		// log( this.parent._viewportWidth )
		// this.offsetLeft = this.el.firstElementChild.offsetLeft;
	},

	_setupImages: function() {
		Utils.each( this.$images, function( el, index ) {
			el.setAttribute('draggable', 'false');
		}.bind(this) );
	}

});


//	Carousel View
//	--------------------------------------------------

var CarouselView = View.extend({

	props: {
		app: 'state',
		parent: 'state',
		offsetHeight: ['number', true, 0],
		offsetWidth: ['number', true, 0],

		$items: ['array', true, function() { return []; }],
		$viewport: 'element',
		$pane: 'element',

		//	Options
		hasPoints: 'boolean',
		hasNav: ['boolean', true, false],
		hasPercentageLayout: ['boolean', true, true],
		hasAutoTimer: ['any', true, false], // Takes timer delay or boolean.
		breakpoints: ['object', true, function() { return { type: 'max', target: 'tablet-wide' }; }],

		//	Objects
		// _itemsTotal: ['number', true, 0],
		_carouselItemViews: ['array', true, function() { return []; }],
		_carouselPoints: ['array', true, function() { return []; }],
		_handlers: ['array', false, function() { return []; }],
		_autoTimer: 'any',
		
		//	States
		_isReady: ['boolean', true, false],
		_isEnabled: ['boolean', true, false],
		_selectedIndex: ['number', true, 0],	//	Automatic positioning based on selected index
		_selectedPosition: ['number', true, 0],	//	Manual positioning without a set selected index

		// _itemWidth: ['number', true, 100],
		// _itemsPerPage: ['number', true, 1],

		_isPointerDown: ['boolean', true, false],
		_isDragging: ['boolean', true, false],
		_isPreventingClick: ['boolean', true, false],
		_isTouchScrolling: ['boolean', true, false],
		_isAutoAnimating: ['boolean', true, false],
		_boundDragEvents: 'any',

		//	Behavior
		_friction: ['number', true, 0.07],
		_dragScale: ['number', true, 75],
		_dragStartThreshold: ['number', true, 10],
		_dragTime: ['date', true, 0],
		_dragTimePrev: ['date', true, 0],
		_yScrollStart: ['number', true, 0],
		_yScrollPointerStart: ['number', true, 0],
		_autoTimerDelay: ['number', true, 8000],

		//	Percentages
		_xPos: ['number', true, 0],
		_xDrag: ['number', true, 0],
		_yDrag: ['number', true, 0],
		_xDragPrev: ['number', true, 0],
		_yDragPrev: ['number', true, 0],
		_xDragStart: ['number', true, 0],
		_yDragStart: ['number', true, 0],
		_paneWidth:  ['number', true, 0]
	},

	derived: {
		_itemsTotal: {
			deps: ['$items'],
			fn: function() {
				return this.$items.length;
			}
		},
		_itemsPerPage: {
			deps: ['$items', 'app._breakpoint'],
			fn: function() {
				// return 1;
				if ( !this.hasPercentageLayout ) return 1;
				var content = Utils.DOM.getAfterAttr( this.$items[0] );
				return typeof content === 'undefined' ? 1 : parseInt( content );
			}
		},
		_itemWidth: {
			deps: ['_itemsPerPage'],
			fn: function() {
				return 100 / this._itemsPerPage;
			}
		},
		_itemLast: {
			deps: ['_itemsTotal'],
			fn: function() {
				if ( this._itemsTotal < 1 ) return; 
				return this._carouselItemViews[ this._itemsTotal - 1 ];
			}
		},
		// _isLastItemActive: {
		// 	deps: ['_selectedIndex', '_itemsTotal'],
		// 	fn: function() {
		// 		return this._selectedIndex === this._itemsTotal - 1;
		// 	}
		// },
		_pagesTotal: {
			deps: ['_itemsTotal', '_itemsPerPage'],
			fn: function() {
				if ( !this.hasPercentageLayout ) return 0;
				return Math.ceil( this._itemsTotal / this._itemsPerPage );
			}
		},
		_currentPage: {
			deps: ['_selectedIndex', '_itemsPerPage', '_itemsTotal'],
			fn: function() {
				if ( !this.hasPercentageLayout ) return 0;
				// If last item, show last page
				if ( this._selectedIndex + ( this._itemsPerPage ) === this._itemsTotal ) {
					return this._pagesTotal - 1;
				}
				return Math.round( this._selectedIndex / this._itemsPerPage );
			}
		},
		_viewportWidth: {	//	Width in px.
			deps: ['app._windowWidth'],
			fn: function() {
				return this.$viewport.offsetWidth;
			}
		},
		// _paneWidth: {	//	Width in perc of viewportWidth, derived from last item.
		// 	deps: ['_viewportWidth', '_itemLast', '_itemLast._offsetLeftPerc'],
		// 	fn: function() {
		// 		var _this = this;
		// 		if ( this.hasPercentageLayout || !this._itemLast ) return 0;
		// 		log(this, this._itemLast);
		// 		log('update pane width', this._itemLast._offsetLeftPerc, this._itemLast._offsetWidthPerc);
				
		// 		log( (this._itemLast.el.firstElementChild.getBoundingClientRect().left / this._viewportWidth * 100) + (this._itemLast.el.firstElementChild.getBoundingClientRect().width / this._viewportWidth * 100) );
		// 		log( this._itemLast._offsetLeftPerc + this._itemLast._offsetWidthPerc );
		// 		// setTimeout( function() {
		// 		// 	log('update pane width 2ND', _this._itemLast._offsetLeftPerc, _this._itemLast._offsetWidthPerc);
					
		// 		// }.bind(this), 0);
		// 		return (this._itemLast.el.firstElementChild.getBoundingClientRect().left / this._viewportWidth * 100) + (this._itemLast.el.getBoundingClientRect().width / this._viewportWidth * 100); //this._itemLast._offsetLeftPerc + this._itemLast._offsetWidthPerc;
		// 	}
		// },
		_isActive: {
			deps: ['_itemsTotal', '_itemsPerPage', 'app._breakpoint'],
			fn: function() {
				var isItemCount = this._itemsTotal > 0 && this._itemsTotal > this._itemsPerPage;
				var isBreakpoint = Utils.MQ[ this.breakpoints.type ]( this.breakpoints.target, this.app._breakpoint, FRONT.breakpoints );
				return isItemCount && isBreakpoint;
			}
		},
		_xTo: {
			deps: ['_viewportWidth', '_selectedPosition', '_selectedIndex', '_itemWidth'],
			fn: function() {
				if ( !this.hasPercentageLayout ) {
					return this._selectedPosition;
				} 
				return this._selectedIndex * this._itemWidth;
			}
		},
		_xDiff: {
			deps: ['_xTo', '_xPos'],
			fn: function() {
				return +(this._xTo - this._xPos).toFixed(2);
			}
		},
		_xVelocity: {
			deps: ['_xDiff', '_friction'],
			fn: function() {
				// return Utils.clamp( this._xDiff * this._friction, -4.5, 4.5);
				return this._xDiff * this._friction;
			}
		},
		_needsUpdate: {
			deps: ['_xDiff', '_xDrag'],
			fn: function() {
				return Math.abs( this._xDiff ) > 0.1 || Math.abs( this._xDrag ) > 0.1;
			}
		},
		_hasAutoTimer: {
			deps: ['hasAutoTimer'],
			fn: function() {
				return this.hasAutoTimer !== false;
			}
		}
	},

	bindings: {
		'_isActive': {
			type: 'booleanClass',
			yes: 'ui-carousel--active'
		},
		'_isLastItemActive': {
			type: 'booleanClass',
			yes: '-is-lastitem-active'
		}
	},

	eventHandlers: {
		down: '_pointerDownHandler',
		move: '_pointerMoveHandler',
		end: '_pointerUpHandler'
	},

	eventHandlerMapping: {
		mousedown: [
			{ e: 'mousemove', h: 'move' }, 
			{ e: 'mouseup', h: 'end' } 
		],
		touchstart: [
			{ e: 'touchmove', h: 'move' },
			{ e: 'touchend', h: 'end' }, 
			{ e: 'touchcancel', h: 'end' }, 
		],
		pointerdown: [ 
			{ e: 'pointermove', h: 'move' },
			{ e: 'pointerup', h: 'end' }, 
			{ e: 'pointercancel', h: 'end' }, 
		],
		MSPointerDown: [ 
			{ e: 'MSPointerMove', h: 'move' },
			{ e: 'MSPointerUp', h: 'end' }, 
			{ e: 'MSPointerCancel', h: 'end' }, 
		]
	},

	events: {},

	initialize: function() {
		this._setupStructure();

		this._updatePosition = this._updatePosition.bind( this );
		this._handlers.click = this._clickHandler.bind( this );
		this._handlers.down = this._pointerDownHandler.bind( this );

		this.listenToAndRun( this, 'change:_isActive', this._isActiveHandler.bind( this ) );
		// this.enable();
		return this;
	},

	//	Event Handlers	 ----------------

	handleEvent: function( e ) {
		this[ this._boundDragEvents[ e.type ]]( e );
	},

	_isActiveHandler: function() {
		this[ this._isActive ? 'enable' : 'disable' ]();
	},

	_clickNavHandler: function( target, e ) {
		e.preventDefault();
		var dir = target.getAttribute('data-carousel-dir');
		this[ dir > 0 ? 'next' : 'previous' ]();
		//	Reset auto timer
		// this._initializeAutoTimer();
	},

	_clickHandler: function( e ) {
		if ( !this._isPreventingClick ) return;
		e.preventDefault();
		e.stopPropagation();
	},

	_pointerDownHandler: function( e ) {
		if ( this._isPointerDown ) return;

		var pageX = e.pageX || e.changedTouches[0].pageX;
		var pageY = e.pageY || e.changedTouches[0].pageY;

		this._bindDragEvents( e );

		this._isPointerDown = true;
		this._xPointerDown = pageX;
		this._yPointerDown = pageY;
		this._xPosStart = this._xPos;
	},

	_pointerMoveHandler: function( e ) {
		if ( !this._isPointerDown || typeof this._xDragPrev !== 'number' ) return;

		// alert();
		var pageX = e.pageX || e.changedTouches[0].pageX;
		var pageY = e.pageY || e.changedTouches[0].pageY;

		var vector = {
			x: this._xPointerDown - pageX,
			y: this._yPointerDown - pageY
		};

		// if( e.pageX > 0 )
		// alert(e.pageX);

		if ( !this._isDragging && this._hasDragStarted( vector ) ) {
			this._dragStart( e );
		}

		this._touchMoveHandler( e, vector );
		this._dragMove( e, vector );
	},

	_pointerUpHandler: function( e ) {
		// log('-- POINTER up', this);
		this._isPointerDown = false;
		this._bindDragEvents( e, false );
		
		this._dragEnd( e );
	},

	_touchMoveHandler: function( e, vector ) {
		if ( e.type !== 'touchmove' ) return;
		if ( !this._isTouchScrolling && Math.abs( vector.y ) > 16 ) {
		// 	this._yScrollStart = window.pageYOffset;
		// 	log('e.pageY, window.pageYOffset', e.pageY, window.pageYOffset)
		// 	this._yScrollPointerStart = e.pageY - window.pageYOffset;
		// 	log('this._yScrollPointerStart', this._yScrollPointerStart);
			// this._isTouchScrolling = true;
		}
		// if ( !this._isTouchScrolling ) { return; }

		// var yScrollDelta = this._yScrollPointerStart - e.pageY - window.pageYOffset;
		// var yScroll = this._yScrollStart + yScrollDelta;
		// log( 'yScroll', yScroll );
		// window.scroll( window.pageXOffset, yScroll );

	},

	/**
	 *  Binds appropriate events for whichever pointer event is triggered. Also unbinds.
	 *  @param  {Event} 	e    	The triggered event
	 *  @param  {Boolean} 	bind 	Bind or unbind
	 */
	_bindDragEvents: function( e, bind ) {
		var _this = this;
		bind = typeof bind === 'undefined' ? true : bind;
		if ( !e || !bind && !this._boundDragEvents ) return;

		var node = bind ? ( e.preventDefault ? window : document ) : this._boundDragEvents.node;
		var events = bind ? this.eventHandlerMapping[ e.type ] : this._boundDragEvents.events;
		var bindMethod = bind ? node.addEventListener : node.removeEventListener;
		var boundDragEvents = {
			events: events,
			node: node
		};
		
		for ( var i = 0; i < events.length; i++ ) {
			var map = events[ i ];
			if ( bind ) {
				boundDragEvents[ map.e ] = this.eventHandlers[ map.h ];
			}
			bindMethod( map.e, this, false );	
		}

		//	If binding events and is on an auto timer, cancel auto timer.
		this[ bind ? '_cancelAutoTimer' : '_initializeAutoTimer' ]();

		this._boundDragEvents = bind ? boundDragEvents : false;
	},

	//	Public Methods	 ----------------

	enable: function() {
		if ( this._isEnabled ) return;
		this._initializeAnimation();
		this._initializeAutoTimer();

		// 	Click
		this.$viewport.addEventListener('click', this._handlers.click, false );
		// 	Mouse down
		this.$viewport.addEventListener('mousedown', this._handlers.down, false);
		this.$viewport.addEventListener('touchstart', this._handlers.down, false);
		this.$viewport.addEventListener('pointerdown', this._handlers.down, false);
		this.$viewport.addEventListener('MSPointerDown', this._handlers.down, false);

		this._isEnabled = true;
	},

	disable: function() {
		if ( !this._isEnabled ) return;
		this.reset();
		this._cancelAnimation();
		this._cancelAutoTimer();

		// 	Click
		this.$viewport.removeEventListener('click', this._handlers.click, false );
		// 	Mouse down
		this.$viewport.removeEventListener('mousedown', this._handlers.down, false);
		this.$viewport.removeEventListener('touchstart', this._handlers.down, false);
		this.$viewport.removeEventListener('pointerdown', this._handlers.down, false);
		this.$viewport.removeEventListener('MSPointerDown', this._handlers.down, false);

		this._isEnabled = false;
	},

	next: function() {
		var index = this._selectedIndex + 1 > ( this._itemsTotal - this._itemsPerPage ) ? 0 : this._selectedIndex + 1;
		this.setSelectedIndex( index );
	},

	previous: function() {
		var index = this._selectedIndex - 1 < 0 ? ( this._itemsTotal - this._itemsPerPage ) : this._selectedIndex - 1;
		this.setSelectedIndex( index );
	},

	gotoPage: function( page ) {
		var index = this._itemsPerPage * page;
		this.setSelectedIndex( index );
	},

	gotoEnd: function() {
		var index = this._itemsTotal;
		this.setSelectedIndex( index );
	},

	setSelectedIndex: function( index ) {
		this._selectedIndex = Math.min( Math.max( index, 0 ), this._itemsTotal - this._itemsPerPage );
	},

	setPosition: function( xPerc ) {
		this._selectedPosition = Utils.MATH.clamp( xPerc, 0, this._paneWidth - 100);
	},

	setPositionByIndex: function( index ) {
		// if ( !this._isActive ) return;
		var xPerc = this._carouselItemViews[ index ]._offsetLeftPerc;
		this.setPosition( xPerc );
	},

	reset: function() {
		this._selectedIndex	= 0;
		this._selectedPosition = 0;
		this.$pane.style[ FRONT.app._transformProperty ] = '';
	},

	//	Private Methods	 ----------------

	/**
	 *  Create viewport and carousel pane
	 */
	_setupStructure: function() {
		var _this = this;
		Utils.DOM.addClass( this.el, 'ui-carousel' );
		// this.$eventsNode = e.preventDefault ? window : document;

		this.$pane = document.createElement('div');
		this.$pane.className = 'ui-carousel-pane';
		this.$viewport = document.createElement('div');
		this.$viewport.className = 'ui-carousel-viewport';

		this.$viewport.appendChild( this.$pane );
		this.el.appendChild( this.$viewport );
		
		if ( this._itemsTotal < 1 ) return;

		Utils.each( this.$items, this._setupCarouselItem.bind( this ));
		this.offsetWidth = this.$viewport.offsetWidth;

		this._setupNav();
		this._setupPoints();

		this.listenTo( this._itemLast, 'change:_offsetLeftPerc', this._updatePane.bind( this ));
		this.on( 'carousel:go', this.setPositionByIndex.bind( this ));

		this.trigger('carousel:ready');
		this._isReady = true;
	},

	/**
	 *  Create view and instantiate for each item in the carousel
	 *  @param  {element} el
	 *  @param  {number} index
	 */
	_setupCarouselItem: function( el, index ) {
		var carouselItem = new CarouselItemView({ el: el, index: index, parent: this });
		this._carouselItemViews.push( carouselItem );
		Utils.DOM.addClass( carouselItem.el, 'ui-carousel-item' );
		this.$pane.appendChild( carouselItem.el );
		this.registerSubview( carouselItem );
	},

	_updatePane: function() {
		if ( this.hasPercentageLayout || !this._itemLast ) return 0;
		this._paneWidth = Math.max( 100, this._itemLast._offsetLeftPerc + this._itemLast._offsetWidthPerc );
		this._selectRestingPosition();
	},

	/**
	 *  Create carousel previous & next arrow navigation.
	 */
	_setupNav: function() {
		if ( !this.hasNav ) return;
		this.$navPrev = document.createElement('a');
		this.$navNext = document.createElement('a');
		Utils.DOM.setAttributes( this.$navPrev, { 'href': '#', 'data-hook': 'ui-carousel-prev', 'data-carousel-dir': '-1' });
		Utils.DOM.setAttributes( this.$navNext, { 'href': '#', 'data-hook': 'ui-carousel-next', 'data-carousel-dir': '1' });
		
		this.$navPrev.className = 'ui-carousel-nav -left';
		this.$navNext.className = 'ui-carousel-nav -right';
		this.$navPrev.innerHTML = '<svg><use xlink:href="#icon-caret-left"/></svg>';
		this.$navNext.innerHTML = '<svg><use xlink:href="#icon-caret-right"/></svg>';

		this.el.appendChild( this.$navPrev );
		this.el.appendChild( this.$navNext );

		Utils.DOM.addClass( this.el, '-has-nav' );

		this.$navPrev.addEventListener( 'click', this._clickNavHandler.bind( this, this.$navPrev ) );
		this.$navNext.addEventListener( 'click', this._clickNavHandler.bind( this, this.$navNext ) );
	},

	/**
	 *  Create CarouselPointView navigation for each page of items
	 */
	_setupPoints: function() {
		if ( !this.hasPoints ) return;
		this.$navPoints = document.createElement('div');
		this.$navPoints.className = 'ui-carousel-points';
		this.el.appendChild( this.$navPoints );
		
		this.listenToAndRun( this, 'change:_pagesTotal', this._updatePoints.bind( this ) );
		// this._updatePoints();
	},

	_updatePoints: function() {
		var _this = this;
		this._carouselPoints = [];
		this.$navPoints.innerHTML = '';
		if ( this._pagesTotal < 2 ) { return; }
		for ( var i = 0; i < this._pagesTotal; i++ ) {
			var pointView = new CarouselPointView({ parent: _this, index: i });
			_this.$navPoints.appendChild( pointView.render().el );
			_this._carouselPoints.push( pointView );
		};
	},


	//	Drag Handlers

	_dragStart: function( e ) {
		e.preventDefault();
		e.stopPropagation();

		// alert('dragstart');
		this._isPreventingClick = true;
		this._isDragging = true; 
		this._xDragStart = typeof e.pageX === 'number' ? e.pageX : 0;
		// this._yDragStart = e.pageY;

		// log( '------------ DRAG START' );
		// return false;
	},

	_dragMove: function( e, vector ) {
		if ( !this._isDragging ) { return; }
		e.preventDefault();

		this._xDragPrev = this._xPos;
		// this._yDragPrev = this._yDrag;
		this._xDrag = +((vector.x / this._viewportWidth) * this._dragScale).toFixed(2);
		// this._yDrag = +((vector.y / this.offsetWidth) * 100).toFixed(2);
		this._xPos = +(this._xPosStart + this._xDrag).toFixed(2);

		this._dragTimePrev = this._dragTime;
  		this._dragTime = new Date().getTime();
	},

	_dragEnd: function( e ) {
		if ( !this._isDragging ) { return; }

		this._isDragging = false;
		this._isTouchScrolling = false;

		setTimeout( function() {
			this._isPreventingClick = false;
		}.bind( this ));

		// var index = this._selectRestingIndex();
		// this.setSelectedIndex( index );

		this._selectRestingPosition();

		// log( '------------ DRAG END' );
		this._xDrag = 0;
		// this._yDrag = 0;
		this._xDragPrev = 0;
		// this._yDragPrev = 0;

		return false;
	},

	//	Drag Helpers

	_hasDragStarted: function( vector ) {
		return Math.abs( vector.x ) > this._dragStartThreshold && Math.abs( vector.x ) > Math.abs( vector.y );
	},

	//	Animation / Physics

	_initializeAnimation: function() {
		this._updatePosition();
	},

	_initializeAutoTimer: function() {
		if ( !this._hasAutoTimer ) return;
		// this._autoTimerDelay = !!delay && typeof delay !== 'undefined' ? delay : this._autoTimerDelay;
		this._cancelAutoTimer();
		this._autoTimer = setInterval( this.next.bind( this ), this._autoTimerDelay );
		this._isAutoAnimating = true;
	},

	_cancelAnimation: function() {
		Utils.raf.cancel( this.animationFrame );
	},

	_cancelAutoTimer: function() {
		clearInterval( this._autoTimer );
		this._isAutoAnimating = false;
	},

	_updatePosition: function( time ) {
		this.animationFrame = Utils.raf( this._updatePosition );
		if ( !this._needsUpdate ) {  return;  }
		if ( !this._isDragging ) {
			this._xPos = +(this._xPos + this._xVelocity).toFixed(2);
		}
		
		this.$pane.style[ FRONT.app._transformProperty ] = FRONT.app._hasTransforms3d ? 'translate3d(' + (this._xPos * -1) + '%, 0, 0)' : 'translate(' + (this._xPos * -1) + '%, 0)';
	},

	// _selectRestingIndex: function() {
	// 	var timeDelta = this._dragTime - this._dragTimePrev;
		
	// 	if ( timeDelta && typeof this._xDragPrev === 'number' ) {
	// 		timeDelta /= 1000 / 60;
	// 		var xDelta = +(this._xPos - this._xDragPrev).toFixed(2);
	// 		var xVelocity = +(xDelta / timeDelta).toFixed(2);
	// 		var restingIndex = Math.round( (this._xPos + xVelocity / this._friction ) / this._itemWidth );
	// 	}
	// 	//  else {
	// 	// 	return this._selectedIndex;
	// 	// }

	// 	if ( restingIndex === this._selectedIndex ) {
	// 		if( !xDelta ) { return this._selectedIndex; }
	// 		restingIndex += xVelocity > 0 ? 1 : -1;
	// 	}

	// 	return restingIndex;//Math.round( this._xDrag / this._itemWidth );
	// },

	_selectRestingPosition: function() {
		var timeDelta = this._dragTime - this._dragTimePrev;
		if ( !timeDelta && typeof this._xDragPrev !== 'number') return 0;

		timeDelta /= 1000 / 60;
		var xDelta = +(this._xPos - this._xDragPrev).toFixed(2);
		var xVelocity = +(xDelta / timeDelta).toFixed(2);

		if ( xDelta === 0 ) return 0;
		var restingPosition = this._xPos + xVelocity / this._friction;
	
		if ( this.hasPercentageLayout ) {
			var restingIndex = Math.round( restingPosition / this._itemWidth );
			if ( restingIndex === this._selectedIndex ) {
				if( !xDelta ) { return this._selectedIndex; }
				restingIndex += xVelocity > 0 ? 1 : -1;
			}
			return this.setSelectedIndex( restingIndex );
		} else {
			return this.setPosition( restingPosition );
		}
	},

	_getParentAnchor: function( el ) {
		if ( el.nodeName == 'A' ) { return el; }
		while ( el != document.body ) {
			el = el.parentNode;
			if ( el.nodeName == 'A' ) {
				return el;
			}
		}
	}


});



//	Mixin
//	--------------------------------------------------

var Carousel = {

	props: {
		// $carouselElements: 'array',
		// carouselInstances: 'array'
	},

	//	Public Methods	 ----------------

	initializeCarousel: function( options ) {
		// this.carouselInstances = [];

		var options = Utils.defaults( options, {
			el: this.el,
			$items: null,
			hasNav: false,
			hasPoints: true,
			model: this.model,
			parent: this
		});

		// this.$carouselElements = this.el.querySelectorAll('[data-component="carousel"]');
		// this.carouselObjects = [];
		// Utils.each( config.$el, this._carouselInstance.bind(this) );
		return this._carouselInstance( options );
	},

	//	Private Methods	 ----------------

	_carouselInstance: function( options ) {
		var carouselView = new CarouselView( options );
		this.registerSubview( carouselView );
		return carouselView;
	},
};



//	Exports
//	--------------------------------------------------

module.exports = Carousel;