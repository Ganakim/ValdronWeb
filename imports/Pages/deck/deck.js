import './deck.html';
import './deck.css';

Session.set('currentDeck', null);

Template.deck.helpers({
  decks(){
    return Meteor.user().profile.decks.map((id)=>{
      return Decks.findOne(id);
    });
  },
});

Template.deck.events({
  'click #newDeckBtn': function(){
    Meteor.call('newDeck', (err, deckId)=>{
      if(err){
        console.log(err);
      }
      Session.set('currentDeck', deckId);
      $('.deckListDeck').removeClass('btn-dark');
      setTimeout(()=>{
        $(`#deck_${Session.get('currentDeck')}`).addClass('btn-dark');
      });
    });
  },
  'click .deck-list-item': function(e){
    Session.set('currentDeck', this._id);
    $('.deckListDeck').removeClass('btn-dark');
    $(`#deck_${Session.get('currentDeck')}`).addClass('btn-dark');
  },
  'click .deckListEdit': function(e){
    $('.editing').removeClass('editing');
    $(`#deck_${this._id}>div`).addClass('editing');
    $(`#deck_${this._id}`).parent('.deck-list-item').addClass('editing');
    $(`#deck_${this._id}>div`).attr('contenteditable', 'true');
    $(`#deck_${this._id}>div`).focus();
  },
  'keydown .deckListDeck>div': function(e){
    if(e.keyCode === 13){
      $(e.target).attr('contenteditable', 'false');
      $(e.target).removeClass('editing');
      $(e.target).parent('.deck-list-item').removeClass('editing');
      Meteor.call('update', {type:'Decks', selector:$(e.target).attr('id').substr(5)}, {$set:{name:$(e.target).text().trim()}});
    }
  },
  'click .saveDeckCheck': function(e){
    $(`#deck_${this._id}>div`).attr('contenteditable', 'false');
    $(`#deck_${this._id}>div`).removeClass('editing');
    $(`#deck_${this._id}`).parent('.deck-list-item').removeClass('editing');
    Meteor.call('update', {type:'Decks', selector:$(e.target).closest('.deckListDeck').attr('id').substr(5)}, {$set:{name:$(`#deck_${this._id}>div`).text().trim()}});
  },
  'click .deckListRemove': function(){
    Meteor.call('remove', {type:'Decks', selector: this._id});
  },
  'mouseenter .deckListDeck>div': function(){
    setTimeout(()=>{
      $(`#deck_${this._id}>div`).animate({scrollLeft: $(`#deck_${this._id}>div`).offset().left}, 3000, 'swing', ()=>{
        $(`#deck_${this._id}>div`).animate({scrollLeft: 0}, 100);
      });
    }, 300);
  }
});