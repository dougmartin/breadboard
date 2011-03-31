describe 'Using breadboard with mock Flash connection'
    before
      stub(sparks.util, 'readCookie').and_return(null);
      // mock_request().and_return(sparks.jsonSection, 'application/javascript', 200)
      init();
      sparks.activity.onActivityReady();
      sparks.config.qucsate_server_url = "http://localhost:1234/sparks/qucsator/solve";
    end
    
    before_each
      breadModel('clear');
      receiveEvent('disconnect', 'probe|probe_black', 0);
      receiveEvent('disconnect', 'probe|probe_red', 0);
    end
    
    it "should update flash board correctly"
    
      var sendCalled = false;
    
      var oldSendCommand = sparks.flash.sendCommand;
      sparks.flash.sendCommand = function() {
        sendCalled = true;
        
        arguments[0].should.be "insert_component"
        arguments[1].should.be "resistor"
        arguments[2].search(/resistor.*/).should.be_at_least 0
        arguments[3].should.be "a1,a2"
        arguments[4].should.be "4band"
        arguments[5].should.be null
        arguments[6].should.be "brown,black,brown,gold"
      }
     
      // we add a 100 ohm resistor
      breadModel('insertComponent', 'resistor', {"connections": 'a1,a2', "colors": 'brown,black,brown,gold'});
      breadModel('updateFlash');
      sendCalled.should.be true
      
      
      breadModel('clear');
      sendCalled = false;
      
      sparks.flash.sendCommand = function() {
        sendCalled = true;
        
        arguments[0].should.be "insert_component"
        arguments[1].should.be "resistor"
        arguments[2].search(/resistor.*/).should.be_at_least 0
        arguments[3].should.be "a1,a2"
        arguments[4].should.be "4band"
        arguments[5].should.be "R1"
        arguments[6].should.be "brown,black,brown,gold"
      }
     
      // we add a 100 ohm resistor with a label
      breadModel('insertComponent', 'resistor', {"connections": 'a1,a2', "colors": 'brown,black,brown,gold', "UID": "resistorX/R1"});
      breadModel('updateFlash');
      sendCalled.should.be true
      
      
      breadModel('clear');
      sendCalled = false;
      
      sparks.flash.sendCommand = function() {
        sendCalled = true;
        
        arguments[0].should.be "insert_component"
        arguments[1].should.be "wire"
        arguments[2].search(/wire.*/).should.be_at_least 0
        arguments[3].should.be "left_positive1,a2"
        arguments[4].should.be "0xaa0000"
      }
      
      // we add a wire
      breadModel('insertComponent', 'wire', {"connections": 'left_positive1,a2'});
      breadModel('updateFlash');
      sendCalled.should.be true
      
      sparks.flash.sendCommand = oldSendCommand;
    end
    
end