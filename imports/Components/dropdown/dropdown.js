import './dropdown.html';
import './dropdown.css';

Template.dropdown.helpers({
  is(text){
    return this.type === text;
  },
  currentSort(sortId){
    console.log(this)
    return Session.get(`sortFilter${this.id}`).sort[sortId];
  }
});

Template.dropdown.events({
  'click .title': function(e){
    $(e.target).closest('.title').siblings('.options').toggleClass('h-0');
    $(e.target).closest('.title').children('.indicator').toggleClass('h-0')
  },
  'click .option': function(e){
    $(e.target).closest('.options').toggleClass('h-0');
    console.log(this)
  }
})