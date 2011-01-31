describe 'Activity Interactions'

  before_each
    breadModel('clear');
  end
  
  after_each
    $('#questions_area').remove();
    $('#breadboard').remove();
  end
  
  describe 'Submit buttons'
  
   it 'should be able to click submit'
   
     sparks.debug = true;
     sparks.jsonActivity = {
       "title": "woo",
       "questions": [
         {
           "prompt": "Question 1",
           "correct_answer": ""
         },
         {
           "prompt": "Question 2",
           "correct_answer": ""
         },
         {
           "prompt": "Question 3",
           "correct_answer": ""
         }
       ]
     };
     
     var $breadboardDiv = $("<div>").attr('id','breadboard');
     var $questionsDiv = $("<div>").attr('id','questions_area');
     var $questionsDiv = $("<div>").attr('id','questions_area');
     var $reportDiv = $("<div>").attr('id','report_area');
     $(document.body).append($breadboardDiv);
     $(document.body).append($questionsDiv);
     $(document.body).append($reportDiv);
     
     stub(sparks.util, 'readCookie').and_return(null);
     
     init();
     
     $forms = $questionsDiv.find('form');
     $forms.length.should.be 3
     
     $buttons = $questionsDiv.find(':button');
     $buttons.length.should.be 3
     
     $($buttons[0]).html().should.be "Submit"
     
     $($buttons[0]).attr('disabled').should.be false
     $($buttons[1]).attr('disabled').should.be true
     $($buttons[2]).attr('disabled').should.be true
     
     $($buttons[0]).click();
     
     $($buttons[0]).attr('disabled').should.be true
     $($buttons[1]).attr('disabled').should.be false
     $($buttons[2]).attr('disabled').should.be true
     
     $($buttons[1]).click();
     
     $($buttons[0]).attr('disabled').should.be true
     $($buttons[1]).attr('disabled').should.be true
     $($buttons[2]).attr('disabled').should.be false
     
     $($buttons[0]).parent().parent().should.be_visible
     $reportDiv.should.not.be_visible
     
     $($buttons[2]).click();
     
     $($buttons[0]).parent().parent().should.not.be_visible
     $reportDiv.should.be_visible
     
    end
    
  end
  
  describe 'Next Questions buttons'
  
   it 'should be able to click submit'
   
     sparks.debug = true;
     sparks.jsonActivity = {
       "title": "woo",
       "questions": [
        [
         {
           "prompt": "Question 1",
           "correct_answer": ""
         },
         {
           "prompt": "Question 2",
           "correct_answer": ""
         }
        ],
        [
         {
           "prompt": "Question 4",
           "correct_answer": ""
         },
         {
           "prompt": "Question 5",
           "correct_answer": ""
         }
        ],
       ]
     };
     
     var $breadboardDiv = $("<div>").attr('id','breadboard');
     var $questionsDiv = $("<div>").attr('id','questions_area');
     var $questionsDiv = $("<div>").attr('id','questions_area');
     var $reportDiv = $("<div>").attr('id','report_area');
     $(document.body).append($breadboardDiv);
     $(document.body).append($questionsDiv);
     $(document.body).append($reportDiv);
     
     stub(sparks.util, 'readCookie').and_return(null);
     
     init();
     
     $forms = $questionsDiv.find('form');
     $forms.length.should.be 4
     
     $($forms[0]).parent().should.be_visible
     $($forms[2]).parent().should.not.be_visible
     
     $buttons = $questionsDiv.find(':button');
     $buttons.length.should.be 5
     
     $($buttons[0]).html().should.be 'Submit'
     $($buttons[0]).attr('disabled').should.be false
     
     $($buttons[2]).html().should.be 'Next questions'
     $($buttons[2]).attr('disabled').should.be true
     
     $($buttons[0]).click();
     $($buttons[1]).click();
     
     $($buttons[2]).attr('disabled').should.be false
     
     $($buttons[2]).click();
     
     $($forms[0]).parent().should.not.be_visible
     $($forms[2]).parent().should.be_visible
     
     $($buttons[3]).attr('disabled').should.be false
     $($buttons[4]).attr('disabled').should.be true
     
     $($buttons[3]).click();
     $($buttons[4]).click();
     
     $($forms[2]).parent().parent().should.not.be_visible
     $reportDiv.should.be_visible
      
    end
    
  end

end