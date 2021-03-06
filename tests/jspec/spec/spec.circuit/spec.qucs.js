describe 'Interfacing with QUCS'
    
    describe 'Creating Netlists'
      before_each
        breadModel('clear');
      end
    
      it "should correctly add components"
    
        // We can add a wire
        breadModel('insertComponent', 'wire', {"connections": 'a1,a2'});
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0
     
        // We can add a battery, and the wire won't go away
        breadModel('insertComponent', 'battery', {"connections": 'b2,b3', "voltage": 3});
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/Vdc:battery.* L2 L3 U=\"3 V\"/).should.be_at_least 0   
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0    
      end
  
      it "should correctly add components with json props"
  
        // We can add a wire
        breadModel('insertComponent', 'wire', {"connections": "a1,a2"});
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0
    
        // We can add a battery with a UID
        breadModel('insertComponent', 'battery', {"UID": "myBattery", "connections": "b2,b3", "voltage": "6"});
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/Vdc:myBattery L2 L3 U=\"6 V\"/).should.be_at_least 0   
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0
    
        // We can add a resistor with colors
        breadModel('insertComponent', 'resistor', {"UID": "myResistor", "connections": "b3,b4", "colors": "brown,black,brown,gold"});
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:myResistor L3 L4 R=\"100 Ohm\"/).should.be_at_least 0
        board.components["myResistor"].colors.should.be "brown,black,brown,gold"
    
        // We can add a resistor with a resistance
        breadModel('insertComponent', 'resistor', {"UID": "myResistor2", "connections": "b5,b6", "resistance": "200"});
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:myResistor2 L5 L6 R=\"200 Ohm\"/).should.be_at_least 0
        board.components["myResistor2"].colors[0].should.be "red"
        board.components["myResistor2"].colors[3].should.be "gold"
    
        // We can add a resistor with same UID, UID will be changed
        breadModel('insertComponent', 'resistor', {"UID": "myResistor2", "connections": "b5,b6", "resistance": "200"});
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:myResistor20/).should.be_at_least 0
    
        // We can add a resistor with a resistance, tolerance and label
        breadModel('insertComponent', 'resistor', {"UID": "myResistor3", "connections": "b5,b6", "resistance": "200", 
                                          "tolerance": "0.01", "label": "R1"});
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:myResistor3 L5 L6 R=\"200 Ohm\"/).should.be_at_least 0
        board.components["myResistor3"].colors[0].should.be "red"
        board.components["myResistor3"].colors[3].should.be "brown"
        board.components["myResistor3"].label.should.be "R1"

        // We can add a resistor with a zero resistance
        breadModel('insertComponent', 'resistor', {"UID": "myResistor00", "connections": "b5,b6", "resistance": "0"});
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:myResistor00 L5 L6 R=\"0 Ohm\"/).should.be_at_least 0
      end
  
      it "should correctly remove components"
  
        // We can add a wire
        breadModel('insertComponent', 'wire', {"connections": 'a1,a2'});
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0
     
        // We can add a battery, and the wire won't go away
        breadModel('insertComponent', 'battery', {"connections": 'b2,b3', "voltage": 3});
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/Vdc:battery.* L2 L3 U=\"3 V\"/).should.be_at_least 0   
        netlist.search(/TLIN:wire.* L1 L2 Z=\"0.000001 Ohm\" L=\"1 mm\" Alpha=\"0 dB\"/).should.be_at_least 0    
    
        // We can remove the wire
        breadModel('remove', 'wire', 'a1,a2');
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.*/).should.be -1
    
        // Removing a battery from wrong location should do nothing
        breadModel('remove', 'battery', 'b2,a2');
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/Vdc:battery.*/).should.be_at_least 0
      end
    
    
      it "should correctly add resistors with colors"
        // we can add a 100 ohm resistor
        breadModel('insertComponent', 'resistor', {"connections": 'a1,a2', "colors": 'brown,black,brown,gold'});
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:resistor.* L1 L2 R=\"100 Ohm\"/).should.be_at_least 0
      
        // we can add a 4200 ohm resistor
        breadModel('insertComponent', 'resistor', {"connections": 'b2,b3', "colors": 'yellow,red,red,gold'});
        netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:resistor.* L2 L3 R=\"4200 Ohm\"/).should.be_at_least 0
      end 
    
      it "should be able to add a random resistor"
        // we can add a random resistor
        breadModel('insertComponent', 'resistor', {"connections": 'a1,a6', "UID": "r1"});
        var board = getBreadBoard();
        var res = board.components.r1;
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        var regexp = new RegExp("R:r1 L1 L6 R=\""+res.resistance+" Ohm\"");
        netlist.search(regexp).should.be_at_least 0
      end
    
      it 'should be able to add a component with a ghost hole'
        breadModel('insertComponent', 'resistor', {"connections": 'a1,xx', "colors": "brown,black,brown,gold"});
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/R:resistor.* L1 xx R="100 Ohm/).should.be_at_least 0
      end
    
      it 'should be able to get holes from breadboard'
        // board holes should be mapped to strip
        var a1Hole = getBreadBoard().getHole('a1');
        a1Hole.nodeName().should.be 'L1'
      
        // board holes in a strip should be the same node
        var b1Hole = getBreadBoard().getHole('a1');
        b1Hole.should.be a1Hole
      
        // should be able to get a hole by passing in a hole instead of a string
        var A1Hole = getBreadBoard().getHole(a1Hole);
        A1Hole.should.be a1Hole
      
        // should be able to make ghost holes
        var xHole = getBreadBoard().getHole('x');
        xHole.nodeName().should.be 'x'
      
        // should be able to map holes to ghost holes
        breadModel('mapHole', 'a2', 'y');
        var a2Hole = getBreadBoard().getHole('a2');
        a2Hole.nodeName().should.be 'y'
      end
    
      it 'should be able to map and unmap hole to a ghost hole'
        breadModel('clear');
      
        // breadModel('insert', 'resistor', 'a1,yy', 'brown,black,brown,gold');
        breadModel('mapHole', "a4", "yy");
        breadModel('insertComponent', 'wire', {"connections": 'a4,a6'});
      
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
      
        breadModel('clear');
        breadModel('unmapHole', "a4");
        breadModel('insertComponent', 'wire', {"connections": 'a4,a6'});
      
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L4 L6/).should.be_at_least 0
      end
    
      it 'should be able to unmap a ghost hole when breadboard clears'
        breadModel('clear');
      
        // breadModel('insert', 'resistor', 'a1,yy', 'brown,black,brown,gold');
        breadModel('mapHole', "a4", "yy");
        breadModel('insertComponent', 'wire', {"connections": 'a4,a6'});
      
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        breadModel('clear');
        breadModel('insertComponent', 'wire', {"connections": 'a4,a6'});
      
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L4 L6/).should.be_at_least 0
      end
    
      it 'should be able to map and unmap existing connections'
      
        // breadModel('insert', 'resistor', 'a1,yy', 'brown,black,brown,gold');
        breadModel('insertComponent', 'wire', {"connections": 'a4,a6'});
      
        breadModel('mapHole', "a4", "yy");
      
        var board = getBreadBoard();
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* yy L6/).should.be_at_least 0
      
        breadModel('unmapHole', "a4");
      
        var netlist = sparks.circuit.qucsator.makeNetlist(board);
        netlist.search(/TLIN:wire.* L4 L6/).should.be_at_least 0
      end
    
    
      it "should be able to add inductors"
        var board, netlist;
      
        breadModel('insertComponent', 'inductor', { UID: 'L1', connections: 'a1,a2', inductance: 1.23 });
        board = getBreadBoard();
        netlist = sparks.circuit.qucsator.makeNetlist(board);
      
        netlist.search(/L:L1 L1 L2 L=\"1.23 H\"/).should.be_at_least 0
      end
    
    
      it "should be able to add capacitors"
        var board, netlist;
    
        breadModel('insertComponent', 'capacitor', { UID: 'C1', connections: 'a1,a2', capacitance: 2.34 });
        board = getBreadBoard();
        netlist = sparks.circuit.qucsator.makeNetlist(board);
    
        netlist.search(/C:C1 L1 L2 C=\"2.34 F\"/).should.be_at_least 0
      end
    
    end
    
    describe 'Parsing returned QUCS results'
    
      it 'should be able to parse a single-value results with simple numbers'
        var results = 
          "<Qucs Dataset 0.0.15>\n"+
          "<indep meter.V 1>\n"    +
          "  -9.00000000000e+00\n" +
          "</indep>\n"             +
          "<indep source.I 1>\n"   +
          "  -1.03807827262e-05\n" +
          "</indep>\n"             +
          "<indep L23.V 1>\n"      +
          "  +0.00000000000e+00\n" +
          "</indep>\n"             +
          "<indep L17.V 1>\n"      +
          "  +9.00000000000e+00\n" +
          "</indep>\n"             +
          "<indep powerPosL.V 1>\n"+
          "  +9.00000000000e+00\n" +
          "</indep>";
        
        var parsed = sparks.circuit.qucsator.parse(results);
        
        parsed.meter.v.should.eql [new sparks.ComplexNumber(-9)]
        parsed.source.i.should.eql [new sparks.ComplexNumber(-1.03807827262e-05)]
        parsed.L23.v.should.eql [new sparks.ComplexNumber(0)]
      end
      
      it 'should be able to parse a multi-value results with simple numbers'
        var results = 
          "<Qucs Dataset 0.0.15>\n"+
          "<indep acfrequency 3>\n"+
          "  +1.00000000000e+00\n" +
          "  +5.00000000000e+00\n" +
          "  +9.00000000000e+00\n" +
          "</indep>\n"             +
          "<dep meter.V V1>\n"     +
          "  +2.00000000000e+00\n" +
          "  +2.00000000000e+00\n" +
          "  +2.00000000000e+00\n" +
          "</dep>\n"               +
          "<dep source.I V1>\n"    +
          "  +1.00000000000e+12\n" +
          "  +1.00000000000e+12\n" +
          "  +1.00000000000e+12\n" +
          "</dep>"
        
        var parsed = sparks.circuit.qucsator.parse(results);
        
        // parsed.source is an array, and parsed.source.I is also an array.
        // a basic .eql someArray won't work for parsed.source, because it will
        // find parsed.source.I, so we do this to extract just the array
        parsed.acfrequency.should.eql [new sparks.ComplexNumber(1), new sparks.ComplexNumber(5), new sparks.ComplexNumber(9)]
        parsed.meter.v.should.eql [new sparks.ComplexNumber(2), new sparks.ComplexNumber(2), new sparks.ComplexNumber(2)]
        parsed.source.i.should.eql [new sparks.ComplexNumber(1e12), new sparks.ComplexNumber(1e12), new sparks.ComplexNumber(1e12)]
      end
      
      it 'should be able to parse a multi-value results with complex numbers'
        var results =
          "<Qucs Dataset 0.0.15>\n"       +
          "<indep acfrequency 1>\n"       +
          "  +1.00000000000e+03\n"        +
          "  +2.00000000000e+03\n"        +
          "</indep>\n"                    +
          "<dep source.i acfrequency>\n"  +
          "  +5.34600846482e-17+j4.65206153026e+15\n"   +
          "  +10.34600846482e-17+j4.65206153026e+15\n"  +
          "</dep>\n"                      +
          "<dep meter.i acfrequency>\n"   +
          "  -5.34600846482e-17-j4.65206153026e+15\n"  +
          "  -10.34600846482e-17-j4.65206153026e+15\n" +
          "</dep>"
          
        var parsed = sparks.circuit.qucsator.parse(results);

        parsed.acfrequency.should.eql [new sparks.ComplexNumber(1e3), new sparks.ComplexNumber(2e3)]
        
        var matchSourceI = [
            new sparks.ComplexNumber(5.34600846482e-17, 4.65206153026e+15), 
            new sparks.ComplexNumber(10.34600846482e-17, 4.65206153026e+15)
          ]
        parsed.source.i.should.eql matchSourceI
        
        var matchMeterI = [
            new sparks.ComplexNumber(-5.34600846482e-17, -4.65206153026e+15), 
            new sparks.ComplexNumber(-10.34600846482e-17, -4.65206153026e+15)
          ]
        parsed.meter.i.should.eql matchMeterI
      end
      
    end
    
end
