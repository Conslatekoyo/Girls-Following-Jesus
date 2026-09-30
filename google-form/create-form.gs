/**
 * Girls Following Jesus – Programme Evaluation
 * Builds the Google Form in your Drive. Run createEvaluationForm once.
 */
function createEvaluationForm() {
  var form = FormApp.create('Girls Following Jesus – Programme Evaluation');
  form.setDescription(
    'Thank you for journeying with us! 💕 Your honest feedback helps us grow and serve you better. ' +
    'This form takes about 10 minutes. Your name is optional.'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    'Thank you, sister! 💕 "For I know the plans I have for you," declares the Lord. – Jeremiah 29:11'
  );

  form.addTextItem().setTitle('Name (optional)');

  // Section 1: What you enjoyed most
  form.addPageBreakItem().setTitle('What You Enjoyed Most');

  var sessions = [
    'Core Capital – Who is at the centre of my life?',
    'Capital Compass – What directs my life and decisions?',
    'Capital Toolkit – What has God placed in my hands?',
    'Brand Capital – What do I represent and communicate?',
    'Social Capital – Who has God connected me to?',
    'Dominion Capital – How do I bring all my capital into purposeful Kingdom influence?',
    'Economic Capital – How do I steward financial wealth and use it for life and influence?'
  ];

  form.addGridItem()
    .setTitle('How much did you enjoy each session?')
    .setHelpText('1 = Not at all · 5 = Loved it')
    .setRows(sessions)
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Which session did you enjoy the most?')
    .setChoiceValues(sessions)
    .setRequired(true);

  form.addParagraphTextItem().setTitle('Why was that session your favourite?');
  form.addParagraphTextItem()
    .setTitle('Was there a moment, activity or conversation that really stood out to you?');

  // Section 2: What you took away
  form.addPageBreakItem().setTitle('What You Took Away');

  form.addParagraphTextItem()
    .setTitle('What is the biggest lesson or truth you are taking away from this programme?')
    .setRequired(true);
  form.addParagraphTextItem()
    .setTitle('Which "capital" do you most want to grow in, and what is one step you will take?');
  form.addParagraphTextItem()
    .setTitle('How has this programme changed the way you see yourself, God or your purpose?');

  // Section 3: Continue · Stop · Start
  form.addPageBreakItem().setTitle('Continue · Stop · Start');

  form.addParagraphTextItem().setTitle('🟢 CONTINUE – What should we keep doing?');
  form.addParagraphTextItem().setTitle('🔴 STOP – What should we stop doing or do less of?');
  form.addParagraphTextItem().setTitle('🟡 START – What should we start doing or add?');

  // Section 4: SEAs
  form.addPageBreakItem().setTitle('A Comment on SEAs');

  form.addParagraphTextItem().setTitle('Please share your thoughts on the SEAs.');

  // Section 5: Overall
  form.addPageBreakItem().setTitle('Overall');

  form.addMultipleChoiceItem()
    .setTitle('Overall, how would you rate the programme?')
    .setChoiceValues(['Excellent', 'Very good', 'Good', 'Fair', 'Poor'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Would you recommend Girls Following Jesus to a friend?')
    .setChoiceValues(['Yes, definitely', 'Maybe', 'No'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Any other thoughts, encouragement or prayer requests?');

  form.setAcceptingResponses(true);
  if (typeof form.setPublished === 'function') {
    form.setPublished(true);
  }

  Logger.log('Share this link:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:    ' + form.getEditUrl());
}
