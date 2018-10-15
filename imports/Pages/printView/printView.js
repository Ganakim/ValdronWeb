import './printView.html';
import './printView.css';

//https://docs.google.com/spreadsheets/d/1kgPTew51wWFuwZqZEwL1DxP_C6Go980p864Y3-8K-JM/edit?usp=sharing
//https://docs.google.com/spreadsheets/d/

Template.printView.onCreated(()=>{
  Meteor.call('getStuffPls')
})

Template.printView.helpers({
  deck(){
    console.log(PrintDeck.find().fetch())
    return PrintDeck.find().fetch()
  }
})