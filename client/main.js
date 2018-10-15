import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

import './main.html';
import './routes.js';
import './tools';
//IMPORTS//
import '/imports/Pages/generate/generate.js';
import '/imports/Pages/printView/printView.js';
import '/imports/Components/dropdown/dropdown.js';
import '/imports/Components/cardListWrapper/cardListWrapper.js';
import '/imports/Pages/shop/shop.js';
import '/imports/Pages/adminView/adminView.js';
import '/imports/Pages/deck/deck.js';
import '/imports/Pages/404/404.js';
import '/imports/Components/card/card.js';
import '/imports/Pages/landing/landing.js';
import '/imports/Components/nav/nav.js';

Session.set('content', 'landing');
Session.set('cards', cards);
Session.set('player', undefined);
Session.set('filters', {
  mutation:[],
  habitat:[],
});

var cards = [];
var names = [];
var effects = [];

Template.registerHelper('search', (type, query, id)=>{
  if(id){
    return window[type].findOne(id)[query];
  }else{
    if(query){
      return window[type].find({}, {sort:{name:1}}).fetch();
    }else{
      return window[type].find({}, {sort:{name:1}}).fetch();
    }
  }
});

Template.registerHelper('card', (id, scale)=>{
  if(scale.hash){
    scale=1;
  }
  return {id: id, width: 2.49*scale, height: 3.5*scale};
});

Template.registerHelper('wrapper', (scale, cards, page, classes, id)=>{
  return {scale: scale, cards:cards, page:page, classes:classes, id:id};
});

Template.registerHelper('offset', (i)=>{
  return i+1;
});

Template.registerHelper('divide', (a,b)=>{
  return a/b;
});

Template.registerHelper('capitalize', (a)=>{
  return a[0].toUpperCase() + a.substring(1);
});

Template.registerHelper('pluralize', (a)=>{
  return a + 's';
});

Template.registerHelper('log', (a)=>{
  console.log(a);
});

Template.main.helpers({
  content(){
    return Session.get('content');
  },
  hasNav(){
    return Session.get('nav');
  },
});

Template.main.events({
  'click .dropdownTrigger': function(e){
    var target = $(e.target).hasClass('dropdownTrigger') ? $(e.target) : $(e.target).parent();
    target.next('.dropdown').toggleClass('flat');
    target.children('.dropdownIndicator-left, .dropdownIndicator-right').toggleClass('flat');
  }
});

Template.main.onCreated(()=>{
  Meteor.subscribe('Cards');
  Meteor.subscribe('Effects');
  Meteor.subscribe('Habitats');
  Meteor.subscribe('Sets');
  Meteor.subscribe('Decks');
  Meteor.subscribe('User');
  Meteor.subscribe('LocalDeck')
  Meteor.subscribe('PrintDeck')
});