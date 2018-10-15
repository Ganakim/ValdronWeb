import './cardListWrapper.html';
import './cardListWrapper.css';

Template.cardListWrapper.events({
  'click .tab': function(e){
    $(e.target).closest('.overlay').toggleClass('in', 400);
  },
  'click .save': function(e){
    $(e.target).closest('.overlay').css('right', $(e.target).closest('.overlay').css('right') === '0px' ? $(e.target).closest('.overlay').attr('width') : 0);
    $(e.target).closest('.tab').toggleClass('out');
    console.log('do the saving thing')
  }
});

Template.cardListWrapper.helpers({
  sortAndFilters(){
    return [
      {name:'Habitat', data:Habitats.find().fetch().map((habitat)=>{
        return {type:'checkbox', text:`${habitat.name}`, id:`h${habitat.name}`};
      })},
      {name:'Mutation Level', data:[
        {type:'checkbox', text:'1', id:'ml1'},
        {type:'checkbox', text:'2', id:'ml2'},
        {type:'checkbox', text:'3', id:'ml3'},
        {type:'checkbox', text:'4', id:'ml4'},
        {type:'checkbox', text:'5', id:'ml5'}
      ]},
      {name:'Rarity', data:[
        {type:'checkbox', text:'Common'},
        {type:'checkbox', text:'Uncommon'},
        {type:'checkbox', text:'Rare'},
        {type:'checkbox', text:'Ultrarare'}
      ]},
      {name:'Stats', data:[
        {type:'range', text:'Power', id:'p'},
        {type:'range', text:'Retaliation', id:'r'},
        {type:'range', text:'Toughness', id:'t'},
        {type:'checkbox', text:'Has Effect?', id:'hasEffect'}
      ]},
      {name:'Primary Sorter', options:['Name','Power', 'Retaliation', 'Toughnes', 'Habitat', 'Quantity', 'Rarity', 'Mutation Level'], id:'pSorter'},
      {name:'Secondary Sorter', options:['Name','Power', 'Retaliation', 'Toughnes', 'Habitat', 'Quantity', 'Rarity', 'Mutation Level'], id:'sSorter'}
    ];
  },
  sortFilterId(){
    console.log(this.id)
  }
});