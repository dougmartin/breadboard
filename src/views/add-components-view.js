var workbenchController;

embeddableComponents = {
  resistor: {
    image: "/common/images/blank-resistor.png",
    imageWidth: 108,
    property: "resistance",
    initialValue: 100
  },
  capacitor: {
    image: "/common/images/capacitor.png",
    imageWidth: 48,
    property: "capacitance",
    initialValue: 1e-6
  },
  inductor: {
    image: "/common/images/inductor.png",
    imageWidth: 80,
    property: "inductance",
    initialValue: 1e-6
  },
  wire: {
    image: "/common/images/wire.png",
    imageWidth: 80,
    leadDistance: 5
  }
}

AddComponentsView = function(workbenchController, breadboardController){
  this.breadboardController = breadboardController;

  var self = this,
      component;

  this.$drawer = $(".component_drawer").empty();

  this.lastHighlightedHole = null;

  // create drawer
  for (componentName in embeddableComponents) {
    if (!embeddableComponents.hasOwnProperty(componentName)) continue;

    component = embeddableComponents[componentName];

    this.$drawer.append(
     $("<img class='add_"+componentName+" add_component'>")
      .attr("src", component.image)
      .css("width", component.imageWidth)
      .data("type", componentName)
      .draggable({
        containment: "#breadboard_wrapper",
        helper: "clone",
        start: function(evt, ui) {
          $(ui.helper.context).hide().fadeIn(1200);
        },
        drag: function(evt, ui) {
          if (self.lastHighlightedHole) {
            self.lastHighlightedHole.attr("xlink:href", "#$:hole_not_connected");
          }
          loc = {x: ui.offset.left, y: ui.offset.top+(ui.helper.height()/2)};
          var nearestHole = $($.nearest(loc, "use[hole]")[0]);
          nearestHole.attr("xlink:href", "#$:hole_highlighted");
          self.lastHighlightedHole = nearestHole;
        }
      })
    );
  }

  // todo: don't add this twice
  $(".breadboard").droppable({
    drop: function(evt, ui) {
      var type = ui.draggable.data("type"),
          embeddableComponent = embeddableComponents[type],
          hole = self.lastHighlightedHole.attr("hole"),
          loc = hole + "," + hole,
          possibleValues,
          $propertyEditor = null,
          propertyName,
          initialValue, initialValueEng, initialValueText,
          $editor, props, uid, comp;

      if (embeddableComponent.leadDistance) {
        var num = /\d*$/.exec(hole)[0] * 1;
        num = Math.max(num-embeddableComponent.leadDistance, 1);
        loc = loc.replace(/(\d*)$/, num);
      }

      // insert component into highlighted hole
      props = {
       "type": type,
       "draggable": true,
       "connections": loc
      };
      props[embeddableComponent.property] = embeddableComponent.initialValue;
      uid = self.breadboardController.insertComponent(type, props);

      comp = self.breadboardController.getComponents()[uid];

      // move leads to correct width
      self.breadboardController.checkLocation(comp);

      // update meters
      workbenchController.workbench.meter.update();

      // show editor
      workbenchController.workbench.view.showComponentEditor(uid);
    }
  })
};

AddComponentsView.prototype = {

  openPane: function() {
    $(".component_drawer").animate({left: 0}, 300, function(){
      $(".add_components").css("overflow", "visible");
    });
  }

};

module.exports = AddComponentsView;