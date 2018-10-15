import './adminView.html';
import './adminView.css';

// Template.adminView.onCreated(()=>{
//   var adminLock = ()=>{
//     setTimeout(()=>{
//       if(Meteor.user()){
//         if(!Roles.userIsInRole(Meteor.userId(), 'admin')){
//           Session.set('nav', true);
//           Session.set('content', 'landing');
//         }
//       }else{
//         adminLock();
//       }
//     }, 100);
//   };
//   adminLock();
// });

Session.set('currentCol', false);

Template.adminView.helpers({
  tabs(){
    return [
      {name:'Cards'},
      {name:'Effects'},
      {name:'Habitats'},
      {name:'Decks'},
      {name:'Sets'}
    ];
  },
  email(id){
    Meteor.call('getEmail', id, (err, res)=>{
      if(err){
        console.log(err);
      }
      $(`.colListItem-${id}`).text(res);
    });
    return;
  },
  currentColItem(){
    return Session.get('currentColItem');
  },
  fields(item){
    var data = [];
    for(var a in item){
      var field;
      switch(a){
        case 'effects':
          field = {field:a, data:item[a], required:false};
          break;
        case 'prev':
          field = {field:a, data:item[a], required:false};
          break;
        case 'habitat':
          field = {field:a, data:item[a], required:true, id:true};
          break;
        case 'set':
          field = {field:a, data:item[a], required:true, id:true};
          break;
        default:
          field = {field:a, data:item[a], required:true};
          break;
      }
      if(a !== '_id'){
        data.push(field);
      }
    }
    delete data._id;
    return data;
  },
  is(field){
    return this.field === field;
  }
});

Template.adminView.events({
  'click .card-header': function(e){
    Session.set('currentCol', $(e.target).text().trim());
    Session.set('currentColItem', null);
    if($(e.target).siblings('.card-body').hasClass('flat')){
      $('.card-body').addClass('flat');
      $(e.target).siblings('.card-body').removeClass('flat');
    }else{
      $(e.target).siblings('.card-body').addClass('flat');
    }
  },
  'click .colList>div': function(){
    Session.set('currentColItem', this);
    Session.set('currentEditItem', this);
  },
  'input .input': function(e){
    var localItem = Session.get('currentEditItem');
    var isValid = true;
    if(this.field === "mutation"){
      if($(e.target).text().trim() > 1){
        localItem.prev = [{habitat:'2GxryjqBT5SEP9Cvj'},{habitat:'2GxryjqBT5SEP9Cvj'}];
        Session.set('currentColItem', localItem);
      }else{
        delete localItem.prev;
        Session.set('currentColItem', localItem);
      }
    }
    if(this.required && !$(e.target).text().trim()){
      isValid = false;
    }
    if(isValid){
      switch(this.field){
        case 'effects':
        case 'cards':
          var check = window[Tools.capitalize(this.field)].findOne({name: $(e.target).text().trim()});
          if(check){
            $(e.target).removeClass('text-danger');
            localItem[this.field][$(e.target).attr('id')[$(e.target).attr('id').length - 1]] = check._id;
          }else{
            $(e.target).addClass('text-danger');
          }
          break;
        case 'set':
          var check = window[Tools.pluralize(Tools.capitalize(this.field))].findOne({name: $(e.target).text().trim()});
          if(check){
            $(e.target).removeClass('text-danger');
            localItem[this.field] = check._id;
          }else{
            $(e.target).addClass('text-danger');
          }
          break;
        case 'habitat':
          var check = window[Tools.pluralize(Tools.capitalize(this.field))].findOne({name: $(e.target).text().trim()});
          if(check){
            $(e.target).removeClass('text-danger');
            localItem[this.field] = check._id;
          }else{
            $(e.target).addClass('text-danger');
          }
          break;
        case 'prev':
          switch($(e.target).attr('id').substring(16)){
            case 'habitat':
              var habitat = Habitats.findOne({name: $(e.target).text().trim()});
              if(habitat){
                $(e.target).removeClass('text-danger');
                localItem[this.field][$(e.target).attr('id').substring(15,16)].habitat = habitat._id;
              }else{
                $(e.target).addClass('text-danger');
              }
              break;
            case 'effect':
              localItem[this.field][$(e.target).attr('id').substring(15,16)].effect = $(e.target)[0].checked;
              break;
            default:
              localItem[this.field][$(e.target).attr('id').substring(15,16)][$(e.target).attr('id').substring(16)] = $(e.target).text().trim();
              break;
          }
          break;
        default:
          localItem[this.field] = $(e.target).text().trim();
          break;
      }
      Session.set('currentEditItem', localItem);
    }
  },
  'click .colListItemSave': function(){
    for(var field in Session.get('currentEditItem')){
      var data = {};
      if(field === 'set' && data[field] !== Session.get('currentColItem')[field]){
        Meteor.call('update', {type:'Sets', selector:Session.get('currentColItem')[field]}, {$pull:{cards:Session.get('currentEditItem')._id}});
        Meteor.call('update', {type:'Sets', selecton:Session.get('currentEditItem')[field]}, {$push:{cards:Session.get('currentEditItem')._id}});
      }
      data[field] = Session.get('currentEditItem')[field];
      Meteor.call('update', {type:this.name, selector:Session.get('currentEditItem')._id}, {$set:data});
    }
    Session.set('currentColItem', null);
  },
  'click .colListItemNew': function(){
    var blanks = {
      Cards:{
        name:'New Creature',
        mutation:'1',
        habitat:'2GxryjqBT5SEP9Cvj',
        picture:'/creatureImgs/DefaultPic.png',
        power:'0',
        retaliation: '0',
        toughness:'5',
        set:'7ddYZnk8YZLHntjiD',
        rarity:'1',
        effects:[],
        description:''
      },
      Effects:{
        name:'New Effect',
        type:'H',
        description:'This card can do stuff!'
      },
      Habitats:{
        name:'New Habitat',
        picture:'/public/Grassland.svg',
        primary:'',
        secondary:''
      },
      Sets:{
        name:'New Set',
        cards:[],
        symbol:'/public/creatureImgs/DefaultPic.png'
      }
    };
    Meteor.call('create', this.name, blanks[this.name], (err, res)=>{
      if(err){
        console.log(err);
      }
      if(this.name === 'Cards'){
        Meteor.call('update', {type:'Sets', selector:'7ddYZnk8YZLHntjiD'}, {$push:{cards:res}});
      }
    });
    Session.set('currentColItem', null);
  },
  'click .colListItemDelete':function(){
    var item = Session.get('currentColItem');
    Meteor.call('remove', {type:this.name, selector:item._id}, (err, res)=>{
      if(err){
        console.log(err);
      }
      if(this.name === 'Cards'){
        Meteor.call('update', {type:'Sets', selector:item.set}, {$pull:{cards:item._id}}, (err)=>{
          if(err){
            console.log(err);
          }
        });
      }
    });
    //
    window[this.name].remove(item._id, (err, res)=>{
      if(err){
        console.log(err);
      }
      if(this.name === 'Cards'){
        Sets.update(item.set, {$pull:{cards:item._id}}, (err)=>{
          if(err){
            console.log(err);
          }
        });
      }
    });
    //
    Session.set('currentColItem', null);
  },
  'click .extCardLink':function(){
    Session.set('currentCol', 'Cards');
    Session.set('currentColItem', Cards.findOne(this.toString()));
    $('.card-body').addClass('flat');
    $('.Cards-body').removeClass('flat');
  }
});
