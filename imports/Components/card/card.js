import './card.html';
import './card.css';

Template.card.helpers({
  card(){
    return Cards.findOne(this.id);
  }
});

Template.localCard.helpers({
  card(){
    return LocalDeck.findOne(this.toString());
  }
});