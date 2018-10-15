import './generate.html';
import './generate.css';

Session.set('genCards', [])

Template.generate.helpers({
  genCards(){
    console.log(LocalDeck.find().fetch())
    return LocalDeck.find().fetch()
  }
})

Template.generate.events({
  'click .genBtn': function(){
    console.log($('#habitatSelect').val(), $('#mutationSelect').val(), $('#quantitySelect').val())
    var localCards = []
    Meteor.call('genDeck', $('#habitatSelect').val(), $('#mutationSelect').val(), $('#quantitySelect').val(),(err, res)=>{
      console.log(LocalDeck.find().fetch())
    })
  }
})