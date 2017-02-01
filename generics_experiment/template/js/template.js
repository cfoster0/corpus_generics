var number_of_generic_trials = 10;

function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.generic_trial_series = slide({
    name : "generic_trial_series",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : random_questions,
    
    //this gets run only at the beginning of the block
    present_handle : function(stim) {
	$(".err").hide();
	$("#binary").hide();
	$("#textbox").hide();
	$("#likert").hide();
	this.stim = stim;
  var generics = generate_stim(number_of_generic_trials, true);
	var generic = generics[Math.floor(Math.random() * generics.length)];
	this.generic = generic;
	$(".sentence").html("\"" + generic.Sentence + "\""); // Replace .Sentence with the name of your sentence column
	var question = stim.question.replace("[plural noun]", generic.Noun); // Replace .Noun with the name of your noun column
	question = question.replace("[verb phrase]", generic.VP); // Replace .VP with the name of your verb column
	$(".question").html(question);		
	switch(stim.dependent_measure) {
	case "textbox":
	    $("#textbox_response").val("");
	    $("#textbox").show();
	    $("#textbox_response").on('input', function() {
		exp.responseValue = $(this).val();
	    })
            break;
	case "binary":
	    $('input[name="binarychoice"]').prop('checked', false);
	    $("#binary").show();
            $("input:radio[name=binarychoice]").click(function() {
		exp.responseValue = $(this).val();
	    });
	    break;
	default:
	    $("#likert").show();
            this.init_sliders(); //TODO(chakia): what do we actually what on these sliders? What is the scale?
	}
	exp.responseValue = null;
    },

    button : function() {
	if (exp.responseValue  == null) {
            $(".err").show();
	} else {
            this.log_responses();
        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
            _stream.apply(this);
	}
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.responseValue = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "single_generic_trial",
        "response" : exp.responseValue,
	"question" : this.stim.question,
	"noun" : this.generic.Noun, // Same instructions as above
	"verb phrase" : this.generic.VP, // ""
	"entire sentence" : this.generic.Sentence // ""
      });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  generate_random_questions(number_of_generic_trials);
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "generic_trial_series", 'subj_info', 'thanks'];
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
