/*globals sparks Raphael*/

(function () {
  
  sparks.OscilloscopeView = function () {
    this.$view         = null;
    this.raphaelCanvas = null;
    this.traces        = [];
    this.model         = null;
  };
    
  sparks.OscilloscopeView.prototype = {
    
    width:    400,
    height:   320,
    
    nVerticalMarks:   8,
    nHorizontalMarks: 10,
    nMinorTicks:      5,
    
    viewBgColor:     '#2F85E0',
    traceBgColor:    '#324569',
    tickColor:       '#9EBDDE',
    textColor:       '#D8E1EB',
    traceInnerColor: '#FFFFFF',
    traceOuterColor: '#00E3AE',

    // The famed "MV" pattern...
    setModel: function (model) {
      this.model = model;
      window.humanizeUnits = this.humanizeUnits;
    },
    
    /**
      @returns $view A jQuery object containing a Raphael canvas displaying the oscilloscope traces.
      
      Sets this.$view to be the returned jQuery object.
    */
    getView: function () {
      var $canvasHolder;
      
      this.$view = $('<div>');
      this.$view.css({
        position: 'relative',
        width:    this.width +100,
        height:   this.height+50,
        backgroundColor: this.viewBgColor
      });
      
      $canvasHolder = $('<div class="raphael-holder">').css({
        position: 'absolute',
        top:  10,
        left: 10,
        backgroundColor: this.traceBgColor
      }).appendTo(this.$view);
      
      this.raphaelCanvas = Raphael($canvasHolder[0], this.width, this.height);
      
      this.drawGrid();

      $('<p>CH1 <span class="vscale channel1"></span>V</p>').css({
        position: 'absolute',
        top:   15 + this.height,
        left:  5,
        color: this.textColor
      }).appendTo(this.$view);
      
      $('<p>CH2 <span class="vscale channel2"></span>V</p>').css({
        position: 'absolute',
        top:   15 + this.height,
        left:  5 + this.width / 4,
        color: this.textColor
      }).appendTo(this.$view);
      
      $('<p>M <span class="hscale"></span>s</p>').css({
        position: 'absolute',
        top:   15 + this.height,
        left:  5 + this.width / 2,
        color: this.textColor
      }).appendTo(this.$view);
            
      return this.$view;
    },
      
    renderSignal: function (channel) {
      var s = this.model.getSignal(channel),
          t = this.traces[channel],
          horizontalScale,
          verticalScale;
      
      if (s) {
        horizontalScale = this.model.getHorizontalScale();
        verticalScale   = this.model.getVerticalScale(channel);
        
        // don't render the signal if we've already drawn it at the same scale
        if (!t || (t.amplitude !== s.amplitude || t.frequency !== s.frequency || t.phase !== s.phase || 
                   t.horizontalScale !== horizontalScale || t.verticalScale !== verticalScale)) {
          
          this.removeTrace(channel);
          this.traces[channel] = {
            amplitude:       s.amplitude,
            frequency:       s.frequency,
            phase:           s.phase,
            horizontalScale: horizontalScale,
            verticalScale:   verticalScale,
            raphaelObject:   this.drawTrace(s, horizontalScale, verticalScale)   // TODO add a color argument
          }; 
        }
      }
      else {
        this.removeTrace(channel);
      }
    },
  
    removeTrace: function (channel) {
      if (this.traces[channel]) {
        if (this.traces[channel].raphaelObject) this.traces[channel].raphaelObject.remove();
        delete this.traces[channel];
      }
    },
    
    // Not moved to sparks.math because it's somewhat specialized for scope display
    humanizeUnits: function (val) {
      var prefixes  = ['M', 'k', '', 'm', 'μ', 'n', 'p'],
          order     = Math.floor(Math.log10(val) + 0.01),    // accounts for: Math.log10(1e-6) = -5.999999999999999
          rank      = Math.ceil(-1 * order / 3),
          prefix    = prefixes[rank+2],
          scaledVal = val * Math.pow(10, rank * 3),

          // Make sure it has sensible digits ... noting that only values in range 1.00 .. 5.00 of whatever unit 
          // (e.g, s, ms, μs, or ns) get digits after the decimal point          
          
          decimalPlaces = order % 3 === 0 ? 2 : 0;
      
      return scaledVal.toFixed(decimalPlaces) + prefix;
    },
    
    horizontalScaleChanged: function () {
      var scale = this.model.getHorizontalScale(),
          channel;

      // TODO make the units a little more sophisticated.
      this.$view.find('.hscale').html(this.humanizeUnits(scale));

      for (channel = 1; channel <= this.model.N_CHANNELS; channel++) {
        if (this.traces[channel]) this.renderSignal(channel);
      }
    },
    
    verticalScaleChanged: function (channel) {
      var scale = this.model.getVerticalScale(channel);

      this.$view.find('.vscale.channel'+channel).html(this.humanizeUnits(scale));
      if (this.traces[channel]) this.renderSignal(channel);
    },
    
    drawGrid: function () {
      var r = this.raphaelCanvas,
          path = [],
          x, dx, y, dy;
      
      for (x = dx = this.width / this.nHorizontalMarks; x <= this.width - dx; x += dx) {
        path.push('M');
        path.push(x);
        path.push(0);
        
        path.push('L');
        path.push(x);
        path.push(this.height);      
      }
      
      for (y = dy = this.height / this.nVerticalMarks; y <= this.height - dy; y += dy) {
        path.push('M');
        path.push(0);
        path.push(y);
        
        path.push('L');
        path.push(this.width);
        path.push(y);      
      }
      
      y = this.height / 2;
      
      for (x = dx = this.width / (this.nHorizontalMarks * this.nMinorTicks); x <= this.width - dx; x += dx) {
        path.push('M');
        path.push(x);
        path.push(y-3);
        
        path.push('L');
        path.push(x);
        path.push(y+3);
      }
      
      x = this.width / 2;
      
      for (y = dy = this.height / (this.nVerticalMarks * this.nMinorTicks); y <= this.height - dy; y += dy) {
        path.push('M');
        path.push(x-3);
        path.push(y);
        
        path.push('L');
        path.push(x+3);
        path.push(y);
      }
      
      return r.path(path.join(' ')).attr({stroke: this.tickColor, opacity: 0.5});
    },
    
    drawTrace: function (signal, horizontalScale, verticalScale) {
      var r            = this.raphaelCanvas,
          path         = [],
          h            = this.height / 2,

          overscan     = 5,                       // how many pixels to overscan on either side (see below)
          triggerStart = this.width / 2,          // horizontal position at which the rising edge of a 0-phase signal should cross zero
          
          // (radians/sec * sec/div) / pixels/div  => radians / pixel
          radiansPerPixel = (2 * Math.PI * signal.frequency * horizontalScale) / (this.width / this.nHorizontalMarks), 

          // pixels/div / volts/div => pixels/volt
          pixelsPerVolt = (this.height / this.nVerticalMarks) / verticalScale,
          
          x,
          raphaelObject,
          paths,
          i;
          
      for (x = 0; x < this.width + overscan * 2; x++) {
        path.push(x ===  0 ? 'M' : 'L');
        path.push(x);
        
        // "Overscan" the trace some pixels to either side of the scope window; we will translate the path the same # 
        // of pixels to the right later. This way we don't have negative, i.e., invalid, x-coords in the path string.
        path.push(h - signal.amplitude * pixelsPerVolt * Math.sin((x - overscan - triggerStart) * radiansPerPixel + signal.phase));
      }
      path = path.join(' ');
      
      // "glowy green line" effect by tracing overlaying an oversaturated (greenish white) line over a fatter green line
      paths = [];
      paths.push(r.path(path).attr({stroke: this.traceOuterColor, 'stroke-width': 4.5}));
      paths.push(r.path(path).attr({stroke: this.traceInnerColor, 'stroke-width': 2}));

      raphaelObject = r.set.apply(r, paths);
      
      // translate the path to the left to accomodate the overscan
      raphaelObject.translate(-1 * overscan, 0);

      return raphaelObject;
    }
          
  };
  
}());
